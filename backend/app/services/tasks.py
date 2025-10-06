from __future__ import annotations

from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task
from app.repositories.tasks import TaskRepository
from app.schemas.task import TaskCreate, TaskOut, TaskUpdate


class TaskService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repo = TaskRepository(session)

    async def list_for_event(
        self, event_id: UUID, *, limit: int = 50, offset: int = 0
    ) -> list[TaskOut]:
        rows = await self.repo.list_for_event(event_id, limit=limit, offset=offset)
        return [TaskOut.model_validate(r) for r in rows]

    async def create_under_event(self, event_id: UUID, data: TaskCreate) -> TaskOut:
        # Guard: body must match path
        if data.event_id != event_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="event_id in body does not match path parameter",
            )
        task = Task(**data.model_dump())
        await self.repo.create(task)
        await self.session.commit()
        await self.session.refresh(task)
        return TaskOut.model_validate(task)

    async def get(self, task_id: UUID) -> TaskOut:
        row = await self.repo.get(task_id)
        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
            )
        return TaskOut.model_validate(row)

    async def get_in_event(self, task_id: UUID, event_id: UUID) -> TaskOut:
        row = await self.repo.get_in_event(task_id, event_id)
        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
            )
        return TaskOut.model_validate(row)

    async def update(self, task_id: UUID, data: TaskUpdate) -> TaskOut:
        row = await self.repo.get(task_id)
        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
            )
        patch = data.model_dump(exclude_unset=True)
        for k, v in patch.items():
            setattr(row, k, v)
        await self.session.commit()
        await self.session.refresh(row)
        return TaskOut.model_validate(row)

    async def delete(self, task_id: UUID) -> None:
        row = await self.repo.get(task_id)
        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
            )
        await self.repo.delete(task_id)
        await self.session.commit()
