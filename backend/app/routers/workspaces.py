# app/routers/workspaces.py
from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.schemas.workspace import WorkspaceCreate, WorkspaceOut, WorkspaceUpdate
from app.services.workspaces import WorkspaceService

router = APIRouter(prefix="/workspaces", tags=["workspaces"])

SessionDep = Annotated[AsyncSession, Depends(get_session)]


@router.get("/", response_model=list[WorkspaceOut])
async def list_workspaces_for_user(
    session: SessionDep,
    user_id: UUID,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    svc = WorkspaceService(session)
    return await svc.list_for_user(user_id, limit=limit, offset=offset)


@router.post("/", response_model=WorkspaceOut, status_code=status.HTTP_201_CREATED)
async def create_workspace_for_user(session: SessionDep, user_id: UUID, body: WorkspaceCreate):
    svc = WorkspaceService(session)
    return await svc.create_for_user(user_id, body)


@router.get("/{workspace_id}", response_model=WorkspaceOut)
async def get_workspace(session: SessionDep, workspace_id: UUID):
    svc = WorkspaceService(session)
    return await svc.get(workspace_id)


@router.patch("/{workspace_id}", response_model=WorkspaceOut)
async def update_workspace(session: SessionDep, workspace_id: UUID, body: WorkspaceUpdate):
    svc = WorkspaceService(session)
    return await svc.update(workspace_id, body)


@router.delete("/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workspace(session: SessionDep, workspace_id: UUID):
    svc = WorkspaceService(session)
    await svc.delete(workspace_id)
    return None
