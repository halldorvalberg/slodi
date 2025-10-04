from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.schemas.task import TaskCreate, TaskOut, TaskUpdate
from app.services.tasks import TaskService

router = APIRouter(prefix="/tasks", tags=["tasks"])
SessionDep = Annotated[AsyncSession, Depends(get_session)]

DEFAULT_LIMIT = Query(50, ge=1, le=200)
DEFAULT_OFFSET = Query(0, ge=0)

# ----- collection under event -----


@router.get("/events/{event_id}", response_model=list[TaskOut])
async def list_tasks_for_event(
    session: SessionDep,
    event_id: UUID,
    limit: int = DEFAULT_LIMIT,
    offset: int = DEFAULT_OFFSET,
):
    svc = TaskService(session)
    return await svc.list_for_event(event_id, limit=limit, offset=offset)


@router.post(
    "/events/{event_id}",
    response_model=TaskOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_task_under_event(
    session: SessionDep,
    event_id: UUID,
    body: TaskCreate,
):
    svc = TaskService(session)
    return await svc.create_under_event(event_id, body)


# ----- item endpoints -----


@router.get("/{task_id}", response_model=TaskOut)
async def get_task(session: SessionDep, task_id: UUID):
    svc = TaskService(session)
    return await svc.get(task_id)


@router.patch("/{task_id}", response_model=TaskOut)
async def update_task(session: SessionDep, task_id: UUID, body: TaskUpdate):
    svc = TaskService(session)
    return await svc.update(task_id, body)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(session: SessionDep, task_id: UUID):
    svc = TaskService(session)
    await svc.delete(task_id)
    return None
