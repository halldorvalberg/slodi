from __future__ import annotations

from collections.abc import Sequence
from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.task import Task
from app.repositories.base import Repository


class TaskRepository(Repository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session)

    async def get(self, task_id: UUID) -> Task | None:
        stmt = (
            select(Task)
            .options(
                selectinload(Task.event),  # common for UI
            )
            .where(Task.id == task_id)
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def get_in_event(self, task_id: UUID, event_id: UUID) -> Task | None:
        stmt = select(Task).where(Task.id == task_id, Task.event_id == event_id)
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def list_for_event(
        self,
        event_id: UUID,
        *,
        limit: int = 50,
        offset: int = 0,
    ) -> Sequence[Task]:
        stmt = (
            select(Task)
            .where(Task.event_id == event_id)
            .order_by(Task.name)
            .limit(limit)
            .offset(offset)
        )
        return await self.scalars(stmt)

    async def create(self, task: Task) -> Task:
        await self.add(task)
        return task

    async def delete(self, task_id: UUID) -> int:
        stmt = delete(Task).where(Task.id == task_id)
        res = await self.session.execute(stmt)
        return res.rowcount or 0
