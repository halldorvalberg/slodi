from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.schemas.user import UserCreate, UserOut, UserUpdate
from app.services.users import UserService

router = APIRouter(prefix="/users", tags=["users"])
SessionDep = Annotated[AsyncSession, Depends(get_session)]

DEFAULT_Q = Query(None, description="Search in name/email/auth0_id")
DEFAULT_LIMIT = Query(50, ge=1, le=200)
DEFAULT_OFFSET = Query(0, ge=0)


@router.get("/", response_model=list[UserOut])
async def list_users(
    session: SessionDep,
    q: str | None = DEFAULT_Q,
    limit: int = DEFAULT_LIMIT,
    offset: int = DEFAULT_OFFSET,
):
    svc = UserService(session)
    return await svc.list(q=q, limit=limit, offset=offset)


@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(session: SessionDep, body: UserCreate):
    svc = UserService(session)
    return await svc.create(body)


@router.get("/{user_id}", response_model=UserOut)
async def get_user(session: SessionDep, user_id: UUID):
    svc = UserService(session)
    return await svc.get(user_id)


@router.patch("/{user_id}", response_model=UserOut)
async def update_user(session: SessionDep, user_id: UUID, body: UserUpdate):
    svc = UserService(session)
    return await svc.update(user_id, body)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(session: SessionDep, user_id: UUID):
    svc = UserService(session)
    await svc.delete(user_id)
    return None
