from __future__ import annotations

from collections.abc import Sequence
from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.workspace import Workspace, WorkspaceMembership, WorkspaceRole

from .base import Repository


class WorkspaceRepository(Repository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session)

    async def get(self, workspace_id: UUID) -> Workspace | None:
        stmt = (
            select(Workspace)
            .options(
                # eager-load common collections to avoid N+1 (adjust as needed)
                selectinload(Workspace.programs),
                selectinload(Workspace.events),
                selectinload(Workspace.troops),
            )
            .where(Workspace.id == workspace_id)
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def list_for_user(
        self, user_id: UUID, *, limit: int = 50, offset: int = 0
    ) -> Sequence[Workspace]:
        stmt = (
            select(Workspace)
            .join(WorkspaceMembership, WorkspaceMembership.workspace_id == Workspace.id)
            .where(WorkspaceMembership.user_id == user_id)
            .order_by(Workspace.name)
            .limit(limit)
            .offset(offset)
        )
        return await self.scalars(stmt)

    async def create_for_user(
        self, user_id: UUID, ws: Workspace
    ) -> tuple[Workspace, WorkspaceMembership]:
        await self.add(ws)
        membership = WorkspaceMembership(
            user_id=user_id, workspace=ws, role=WorkspaceRole.owner
        )
        await self.add(membership)
        return ws, membership

    async def delete(self, workspace_id: UUID) -> int:
        stmt = delete(Workspace).where(Workspace.id == workspace_id)
        res = await self.session.execute(stmt)
        return res.rowcount or 0
