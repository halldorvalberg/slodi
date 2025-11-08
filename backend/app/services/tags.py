from __future__ import annotations

from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.tag import Tag
from app.repositories.tags import TagRepository
from app.schemas.tag import (
    ContentTagCreate,
    ContentTagOut,
    TagCreate,
    TagOut,
    TagUpdate,
)


class TagService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repo = TagRepository(session)

    # ----- tags -----

    async def list(self, *, q: str | None, limit: int = 50, offset: int = 0) -> list[TagOut]:
        rows = await self.repo.list(q=q, limit=limit, offset=offset)
        return [TagOut.model_validate(r) for r in rows]

    async def get(self, tag_id: UUID) -> TagOut:
        row = await self.repo.get(tag_id)
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tag not found")
        return TagOut.model_validate(row)

    async def create(self, data: TagCreate) -> TagOut:
        # Optional uniqueness check by name; if you add a DB UniqueConstraint, you can rely on IntegrityError instead
        existing = await self.repo.get_by_name(data.name)
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Tag already exists")
        tag = Tag(**data.model_dump())
        await self.repo.create(tag)
        await self.session.commit()
        await self.session.refresh(tag)
        return TagOut.model_validate(tag)

    async def update(self, tag_id: UUID, data: TagUpdate) -> TagOut:
        tag = await self.repo.get(tag_id)
        if not tag:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tag not found")
        patch = data.model_dump(exclude_unset=True)
        for k, v in patch.items():
            setattr(tag, k, v)
        try:
            await self.session.commit()
        except IntegrityError:
            await self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Tag update violates constraints",
            ) from None
        await self.session.refresh(tag)
        return TagOut.model_validate(tag)

    async def delete(self, tag_id: UUID) -> None:
        tag = await self.repo.get(tag_id)
        if not tag:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tag not found")
        await self.repo.delete(tag_id)
        await self.session.commit()

    # ----- associations -----

    async def list_tags_for_content(
        self, content_id: UUID, *, limit: int = 100, offset: int = 0
    ) -> list[TagOut]:
        rows = await self.repo.list_tags_for_content(content_id, limit=limit, offset=offset)
        return [TagOut.model_validate(r) for r in rows]

    async def add_tag_to_content(self, data: ContentTagCreate) -> ContentTagOut:
        # If composite PK exists, duplicate add will raise IntegrityError
        try:
            ct = await self.repo.add_tag_to_content(data.content_id, data.tag_id)
            await self.session.commit()
        except IntegrityError:
            await self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Tag is already attached to this content",
            ) from None
        return ContentTagOut.model_validate(ct)

    async def remove_tag_from_content(self, content_id: UUID, tag_id: UUID) -> None:
        deleted = await self.repo.remove_tag_from_content(content_id, tag_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tag not attached to content",
            )
        await self.session.commit()

    async def list_content_for_tag(
        self, tag_id: UUID, *, limit: int = 50, offset: int = 0
    ) -> list[UUID]:
        return list(await self.repo.list_content_for_tag(tag_id, limit=limit, offset=offset))
