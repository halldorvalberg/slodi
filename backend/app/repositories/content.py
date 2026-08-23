from __future__ import annotations

from dataclasses import dataclass
from typing import Any
from uuid import UUID

from sqlalchemy import false, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.comment import Comment
from app.models.content import Content
from app.models.like import UserLikedContent
from app.models.tag import ContentTag
from app.repositories.base import Repository


@dataclass
class ContentStats:
    like_count: int
    comment_count: int
    liked_by_me: bool


def like_count_subq() -> Any:
    """Correlated subquery: COUNT of likes for the current Content row."""
    return (
        select(func.count())
        .select_from(UserLikedContent)
        .where(UserLikedContent.content_id == Content.id)
        .correlate(Content)
        .scalar_subquery()
    )


def comment_count_subq() -> Any:
    """Correlated subquery: COUNT of non-deleted comments for the current Content row."""
    return (
        select(func.count())
        .select_from(Comment)
        .where(Comment.content_id == Content.id, Comment.deleted_at.is_(None))
        .correlate(Content)
        .scalar_subquery()
    )


def liked_by_me_subq(current_user_id: UUID | None) -> Any:
    """Correlated EXISTS subquery: True if current_user has liked the row."""
    if current_user_id is None:
        return false()
    return (
        select(UserLikedContent.user_id)
        .where(
            UserLikedContent.content_id == Content.id,
            UserLikedContent.user_id == current_user_id,
        )
        .correlate(Content)
        .exists()
    )


class ContentRepository(Repository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session)

    async def get_author_id(self, content_id: UUID) -> UUID | None:
        return await self.session.scalar(select(Content.author_id).where(Content.id == content_id))

    async def list_by_workspace(
        self,
        workspace_id: UUID,
        current_user_id: UUID | None = None,
        *,
        limit: int = 50,
        offset: int = 0,
    ) -> list[tuple[Content, ContentStats]]:
        stmt = (
            select(
                Content, like_count_subq(), comment_count_subq(), liked_by_me_subq(current_user_id)
            )
            .options(
                selectinload(Content.author),
                selectinload(Content.workspace),
                selectinload(Content.content_tags).selectinload(ContentTag.tag),
            )
            .where(Content.workspace_id == workspace_id, Content.deleted_at.is_(None))
            .order_by(Content.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        rows = (await self.session.execute(stmt)).all()
        return [
            (item, ContentStats(like_count=int(lc), comment_count=int(cc), liked_by_me=bool(lm)))
            for item, lc, cc, lm in rows
        ]

    async def get(
        self, content_id: UUID, current_user_id: UUID | None = None
    ) -> tuple[Content, ContentStats] | None:
        stmt = (
            select(
                Content, like_count_subq(), comment_count_subq(), liked_by_me_subq(current_user_id)
            )
            .options(
                selectinload(Content.author),
                selectinload(Content.workspace),
                selectinload(Content.comments),
                selectinload(Content.content_tags).selectinload(ContentTag.tag),
            )
            .where(Content.id == content_id, Content.deleted_at.is_(None))
        )
        row = (await self.session.execute(stmt)).first()
        if row is None:
            return None
        item, lc, cc, lm = row
        return item, ContentStats(like_count=int(lc), comment_count=int(cc), liked_by_me=bool(lm))

    async def count_by_workspace(self, workspace_id: UUID) -> int:
        stmt = (
            select(func.count())
            .select_from(Content)
            .where(Content.workspace_id == workspace_id, Content.deleted_at.is_(None))
        )
        return int((await self.session.scalar(stmt)) or 0)
