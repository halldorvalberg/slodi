from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.schemas.troop import (
    TroopCreate,
    TroopOut,
    TroopParticipationCreate,
    TroopParticipationOut,
    TroopUpdate,
)
from app.services.troops import TroopService

router = APIRouter(prefix="/troops", tags=["troops"])
SessionDep = Annotated[AsyncSession, Depends(get_session)]

DEFAULT_LIMIT = Query(50, ge=1, le=200)
DEFAULT_OFFSET = Query(0, ge=0)

# ----- troops (workspace-scoped collection) -----


@router.get("/workspaces/{workspace_id}", response_model=list[TroopOut])
async def list_troops_for_workspace(
    session: SessionDep,
    workspace_id: UUID,
    limit: int = DEFAULT_LIMIT,
    offset: int = DEFAULT_OFFSET,
):
    svc = TroopService(session)
    return await svc.list_for_workspace(workspace_id, limit=limit, offset=offset)


@router.post(
    "/workspaces/{workspace_id}",
    response_model=TroopOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_troop_under_workspace(
    session: SessionDep,
    workspace_id: UUID,
    body: TroopCreate,
):
    svc = TroopService(session)
    return await svc.create_under_workspace(workspace_id, body)


# ----- troop item -----


@router.get("/{troop_id}", response_model=TroopOut)
async def get_troop(session: SessionDep, troop_id: UUID):
    svc = TroopService(session)
    return await svc.get(troop_id)


@router.patch("/{troop_id}", response_model=TroopOut)
async def update_troop(session: SessionDep, troop_id: UUID, body: TroopUpdate):
    svc = TroopService(session)
    return await svc.update(troop_id, body)


@router.delete("/{troop_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_troop(session: SessionDep, troop_id: UUID):
    svc = TroopService(session)
    await svc.delete(troop_id)
    return None


# ----- participations -----


@router.get("/events/{event_id}/participants", response_model=list[TroopOut])
async def list_troops_participating_in_event(
    session: SessionDep,
    event_id: UUID,
    limit: int = DEFAULT_LIMIT,
    offset: int = DEFAULT_OFFSET,
):
    svc = TroopService(session)
    return await svc.list_troops_for_event(event_id, limit=limit, offset=offset)


@router.get("/{troop_id}/events", response_model=list[UUID])
async def list_events_for_troop(
    session: SessionDep,
    troop_id: UUID,
    limit: int = DEFAULT_LIMIT,
    offset: int = DEFAULT_OFFSET,
):
    svc = TroopService(session)
    return await svc.list_events_for_troop(troop_id, limit=limit, offset=offset)


@router.post(
    "/participation",
    response_model=TroopParticipationOut,
    status_code=status.HTTP_201_CREATED,
)
async def add_troop_participation(
    session: SessionDep,
    body: TroopParticipationCreate,
):
    svc = TroopService(session)
    return await svc.add_participation(body)


@router.delete("/{troop_id}/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_troop_participation(
    session: SessionDep,
    troop_id: UUID,
    event_id: UUID,
):
    svc = TroopService(session)
    await svc.remove_participation(troop_id, event_id)
    return None
