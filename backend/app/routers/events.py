from __future__ import annotations

import datetime as dt
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.schemas.event import EventCreate, EventOut, EventUpdate
from app.services.events import EventService

router = APIRouter(prefix="/events", tags=["events"])
SessionDep = Annotated[AsyncSession, Depends(get_session)]

DEFAULT_LIMIT = Query(50, ge=1, le=200)
DEFAULT_OFFSET = Query(0, ge=0)
DEFAULT_DATE_FROM = Query(None)
DEFAULT_DATE_TO = Query(None)

# ----- collections -----


@router.get("/workspaces/{workspace_id}", response_model=list[EventOut])
async def list_events_for_workspace(
    session: SessionDep,
    workspace_id: UUID,
    date_from: dt.datetime | None = DEFAULT_DATE_FROM,
    date_to: dt.datetime | None = DEFAULT_DATE_TO,
    limit: int = DEFAULT_LIMIT,
    offset: int = DEFAULT_OFFSET,
):
    svc = EventService(session)
    return await svc.list_for_workspace(
        workspace_id, date_from=date_from, date_to=date_to, limit=limit, offset=offset
    )


@router.get("/workspaces/{workspace_id}/programs/{program_id}", response_model=list[EventOut])
async def list_events_for_program(
    session: SessionDep,
    workspace_id: UUID,
    program_id: UUID,
    date_from: dt.datetime | None = DEFAULT_DATE_FROM,
    date_to: dt.datetime | None = DEFAULT_DATE_TO,
    limit: int = DEFAULT_LIMIT,
    offset: int = DEFAULT_OFFSET,
):
    svc = EventService(session)
    return await svc.list_for_program(
        workspace_id,
        program_id,
        date_from=date_from,
        date_to=date_to,
        limit=limit,
        offset=offset,
    )


# ----- create under program -----


@router.post(
    "/workspaces/{workspace_id}/programs/{program_id}",
    response_model=EventOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_event_under_program(
    session: SessionDep,
    workspace_id: UUID,
    program_id: UUID,
    body: EventCreate,
):
    svc = EventService(session)
    return await svc.create_under_program(workspace_id, program_id, body)


# ----- item endpoints -----


@router.get("/{event_id}", response_model=EventOut)
async def get_event(session: SessionDep, event_id: UUID):
    svc = EventService(session)
    return await svc.get(event_id)


@router.patch("/{event_id}", response_model=EventOut)
async def update_event(session: SessionDep, event_id: UUID, body: EventUpdate):
    svc = EventService(session)
    return await svc.update(event_id, body)


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(session: SessionDep, event_id: UUID):
    svc = EventService(session)
    await svc.delete(event_id)
    return None
