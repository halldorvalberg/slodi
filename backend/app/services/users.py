from __future__ import annotations

from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.users import UserRepository
from app.schemas.user import UserCreate, UserOut, UserUpdate


class UserService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repo = UserRepository(session)

    async def get(self, user_id: UUID) -> UserOut:
        row = await self.repo.get(user_id)
        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        return UserOut.model_validate(row)

    async def list(
        self, *, q: str | None, limit: int = 50, offset: int = 0
    ) -> list[UserOut]:
        rows = await self.repo.list(q=q, limit=limit, offset=offset)
        return [UserOut.model_validate(r) for r in rows]

    async def create(self, data: UserCreate) -> UserOut:
        user = User(**data.model_dump())
        try:
            await self.repo.create(user)
            await self.session.commit()
        except IntegrityError:
            await self.session.rollback()
            # Email or auth0_id unique violation
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email or auth0_id already exists",
            ) from None
        await self.session.refresh(user)
        return UserOut.model_validate(user)

    async def update(self, user_id: UUID, data: UserUpdate) -> UserOut:
        row = await self.repo.get(user_id)
        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        patch = data.model_dump(exclude_unset=True)
        for k, v in patch.items():
            setattr(row, k, v)

        try:
            await self.session.commit()
        except IntegrityError:
            await self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email or auth0_id already exists",
            ) from None
        await self.session.refresh(row)
        return UserOut.model_validate(row)

    async def delete(self, user_id: UUID) -> None:
        row = await self.repo.get(user_id)
        if not row:
            # 404 to be explicit
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        await self.repo.delete(user_id)
        await self.session.commit()
