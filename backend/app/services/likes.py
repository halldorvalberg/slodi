from __future__ import annotations

from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.like import UserLikedContent
from app.repositories.likes import LikeRepository
from app.schemas.like import LikeOut


class LikeService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repo = LikeRepository(session)

    async def count_content_likes(self, content_id: UUID) -> int:
        return await self.repo.count_content_likes(content_id)

    async def list_for_content(
        self, content_id: UUID, *, limit: int = 50, offset: int = 0
    ) -> list[LikeOut]:
        rows = await self.repo.list_for_content(content_id, limit=limit, offset=offset)
        return [LikeOut.model_validate(r) for r in rows]

    async def like_content(self, user_id: UUID, content_id: UUID) -> LikeOut:
        like = UserLikedContent(
            content_id=content_id,
            user_id=user_id,
        )
        await self.repo.create(like)
        await self.session.commit()
        await self.session.refresh(like)
        return LikeOut.model_validate(like)

    async def delete(self, user_id: UUID, content_id: UUID) -> None:
        deleted = await self.repo.delete(user_id=user_id, content_id=content_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Like not found")
        await self.session.commit()
