from __future__ import annotations

from collections.abc import Sequence
from uuid import UUID

from sqlalchemy import Select, and_, delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.group import Group, GroupMembership
from app.repositories.base import Repository


class GroupRepository(Repository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session)

    # ----- groups -----

    async def get(self, group_id: UUID) -> Group | None:
        stmt: Select[tuple[Group]] = (
            select(Group)
            .options(
                selectinload(Group.group_memberships),
                selectinload(Group.workspaces),
            )
            .where(Group.id == group_id)
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def list(
        self, *, q: str | None = None, limit: int = 50, offset: int = 0
    ) -> Sequence[Group]:
        stmt = select(Group).order_by(Group.name)
        if q:
            ilike = f"%{q.strip()}%"
            stmt = stmt.where(Group.name.ilike(ilike))
        stmt = stmt.limit(limit).offset(offset)
        return await self.scalars(stmt)

    async def create(self, group: Group) -> Group:
        await self.add(group)
        return group

    async def delete(self, group_id: UUID) -> int:
        res = await self.session.execute(delete(Group).where(Group.id == group_id))
        return res.rowcount or 0

    # ----- memberships -----

    async def list_members(
        self, group_id: UUID, *, limit: int = 50, offset: int = 0
    ) -> Sequence[GroupMembership]:
        stmt = (
            select(GroupMembership)
            .where(GroupMembership.group_id == group_id)
            .order_by(GroupMembership.user_id)
            .limit(limit)
            .offset(offset)
        )
        return await self.scalars(stmt)

    async def get_membership(self, group_id: UUID, user_id: UUID) -> GroupMembership | None:
        stmt = select(GroupMembership).where(
            and_(GroupMembership.group_id == group_id, GroupMembership.user_id == user_id)
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def add_member(self, membership: GroupMembership) -> GroupMembership:
        await self.add(membership)
        return membership

    async def remove_member(self, group_id: UUID, user_id: UUID) -> int:
        res = await self.session.execute(
            delete(GroupMembership).where(
                and_(
                    GroupMembership.group_id == group_id,
                    GroupMembership.user_id == user_id,
                )
            )
        )
        return res.rowcount or 0
