from __future__ import annotations

from collections.abc import Sequence
from uuid import UUID

from sqlalchemy import Select, and_, delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.tag import ContentTag, Tag
from app.repositories.base import Repository


class TagRepository(Repository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session)

    # ----- tags -----

    async def get(self, tag_id: UUID) -> Tag | None:
        stmt: Select[tuple[Tag]] = (
            select(Tag).options(selectinload(Tag.content_tags)).where(Tag.id == tag_id)
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def get_by_name(self, name: str) -> Tag | None:
        stmt = select(Tag).where(Tag.name == name)
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def list(
        self, *, q: str | None = None, limit: int = 50, offset: int = 0
    ) -> Sequence[Tag]:
        stmt = select(Tag).order_by(Tag.name)
        if q:
            like = f"%{q.strip()}%"
            stmt = stmt.where(Tag.name.ilike(like))
        stmt = stmt.limit(limit).offset(offset)
        return await self.scalars(stmt)

    async def create(self, tag: Tag) -> Tag:
        await self.add(tag)
        return tag

    async def delete(self, tag_id: UUID) -> int:
        res = await self.session.execute(delete(Tag).where(Tag.id == tag_id))
        return res.rowcount or 0

    # ----- associations -----

    async def list_tags_for_content(
        self, content_id: UUID, *, limit: int = 100, offset: int = 0
    ) -> Sequence[Tag]:
        stmt = (
            select(Tag)
            .join(ContentTag, ContentTag.tag_id == Tag.id)
            .where(ContentTag.content_id == content_id)
            .order_by(Tag.name)
            .limit(limit)
            .offset(offset)
        )
        return await self.scalars(stmt)

    async def list_content_for_tag(
        self, tag_id: UUID, *, limit: int = 50, offset: int = 0
    ) -> Sequence[UUID]:
        # return only content IDs here; adjust to join Content if you want full rows
        stmt = (
            select(ContentTag.content_id)
            .where(ContentTag.tag_id == tag_id)
            .limit(limit)
            .offset(offset)
        )
        res = await self.session.execute(stmt)
        return [row[0] for row in res.fetchall()]

    async def add_tag_to_content(self, content_id: UUID, tag_id: UUID) -> ContentTag:
        ct = ContentTag(content_id=content_id, tag_id=tag_id)
        await self.add(ct)
        return ct

    async def remove_tag_from_content(self, content_id: UUID, tag_id: UUID) -> int:
        res = await self.session.execute(
            delete(ContentTag).where(
                and_(ContentTag.content_id == content_id, ContentTag.tag_id == tag_id)
            )
        )
        return res.rowcount or 0
