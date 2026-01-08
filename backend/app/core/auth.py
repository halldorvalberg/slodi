"""
Authentication module for Auth0 JWT token verification and user management.

This module provides:
- JWT token verification using Auth0's public keys (JWKS)
- Automatic user creation on first login
- FastAPI dependency for protecting endpoints with authentication
"""

from functools import lru_cache

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from jose.exceptions import ExpiredSignatureError, JWTClaimsError, JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.db import get_session
from app.models.user import User
from app.schemas.user import UserCreate
from app.services.users import UserService

# HTTPBearer extracts the token from Authorization: Bearer <token> header
security = HTTPBearer()


@lru_cache()
def get_auth0_jwks() -> dict:
    """
    Fetch and cache Auth0 public keys (JWKS) for JWT verification.

    The JWKS (JSON Web Key Set) contains the public keys used by Auth0
    to sign JWT tokens. We cache this to avoid fetching on every request.

    Returns:
        dict: The JWKS response containing public keys

    Raises:
        HTTPException: If unable to fetch JWKS from Auth0
    """
    jwks_url = f"https://{settings.auth0_domain}/.well-known/jwks.json"

    try:
        response = httpx.get(jwks_url, timeout=10.0)
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Unable to fetch Auth0 public keys: {str(e)}"
        ) from e


def verify_auth0_token(token: str) -> dict:
    """
    Verify Auth0 JWT token and extract claims.

    This function:
    1. Gets the unverified header to find which key to use (kid)
    2. Fetches Auth0's JWKS and finds the matching public key
    3. Validates the JWT signature using the public key
    4. Checks token expiration, audience, and issuer
    5. Returns the verified token payload (claims)

    Args:
        token: The JWT token string from Authorization header

    Returns:
        dict: The verified token payload containing user claims
              (sub=auth0_id, email, name, etc.)

    Raises:
        HTTPException: If token is invalid, expired, or verification fails
    """
    try:
        # Get unverified header to find which key to use
        unverified_header = jwt.get_unverified_header(token)

        # Get the key from JWKS
        jwks = get_auth0_jwks()
        rsa_key = {}

        # Find the key that matches the token's kid (key ID)
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break

        if not rsa_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to find appropriate signing key"
            )

        # Verify the token signature and claims
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=settings.auth0_algorithms,
            audience=settings.auth0_audience,
            issuer=f"https://{settings.auth0_domain}/"
        )

        return payload

    except ExpiredSignatureError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        ) from e
    except JWTClaimsError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token claims (audience or issuer mismatch)"
        ) from e
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(e)}"
        ) from e


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: AsyncSession = Depends(get_session)
) -> User:
    """
    FastAPI dependency that authenticates requests and returns the current user.

    This dependency:
    1. Extracts the Bearer token from the Authorization header
    2. Verifies the token with Auth0 (signature, expiration, claims)
    3. Extracts user information from the verified token
    4. Looks up the user in the database by auth0_id
    5. Auto-creates the user if this is their first login
    6. Returns the authenticated User object

    Usage:
        @router.get("/protected")
        async def protected_endpoint(
            current_user: User = Depends(get_current_user)
        ):
            # current_user is guaranteed to be authenticated
            return {"user_id": current_user.id}

    Args:
        credentials: Automatically injected by HTTPBearer security
        session: Database session automatically injected

    Returns:
        User: The authenticated user object

    Raises:
        HTTPException: If authentication fails (invalid token, etc.)
    """
    token = credentials.credentials

    # Verify token and get claims
    payload = verify_auth0_token(token)

    # Extract user info from verified token
    auth0_id = payload.get("sub")
    email = payload.get("email")
    name = payload.get("name") or payload.get("email", "")  # Fallback to email if name not provided

    if not auth0_id or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing required claims (sub or email)"
        )

    # Get or create user
    user_service = UserService(session)
    user = await user_service.get_by_auth0_id(auth0_id)

    if not user:
        # Auto-create user on first login (SAFE because token is verified)
        user_data = UserCreate(
            auth0_id=auth0_id,
            email=email,
            name=name
        )
        user_out = await user_service.create(user_data)
        # Get the actual User model instance
        user = await user_service.get_by_auth0_id(auth0_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user"
            )

    return user
