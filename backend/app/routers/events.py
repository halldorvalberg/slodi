from __future__ import annotations

import datetime as dt
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.pagination import Limit, Offset, add_pagination_headers
from app.models.content import ContentType
from app.schemas.event import EventCreate, EventOut, EventUpdate
from app.services.events import EventService

router = APIRouter(tags=["events"])
SessionDep = Annotated[AsyncSession, Depends(get_session)]

DEFAULT_DATE_FROM = Query(None)
DEFAULT_DATE_TO = Query(None)

# ----- collections -----


@router.get("/workspaces/{workspace_id}/events", response_model=list[EventOut])
async def list_workspace_events(
    session: SessionDep,
    workspace_id: UUID,
    request: Request,
    response: Response,
    date_from: dt.datetime | None = DEFAULT_DATE_FROM,
    date_to: dt.datetime | None = DEFAULT_DATE_TO,
    limit: Limit = 50,
    offset: Offset = 0,
):
    svc = EventService(session)
    total = await svc.count_events_for_workspace(workspace_id, date_from=date_from, date_to=date_to)
    items = await svc.list_for_workspace(
        workspace_id, date_from=date_from, date_to=date_to, limit=limit, offset=offset
    )
    add_pagination_headers(
        response=response,
        request=request,
        total=total,
        limit=limit,
        offset=offset,
    )
    return items


@router.get(
    "/workspaces/{workspace_id}/programs/{program_id}/events",
    response_model=list[EventOut],
)
async def list_program_events(
    session: SessionDep,
    workspace_id: UUID,
    program_id: UUID,
    request: Request,
    response: Response,
    date_from: dt.datetime | None = DEFAULT_DATE_FROM,
    date_to: dt.datetime | None = DEFAULT_DATE_TO,
    limit: Limit = 50,
    offset: Offset = 0,
):
    svc = EventService(session)
    total = await svc.count_events_for_program(
        workspace_id, program_id, date_from=date_from, date_to=date_to
    )
    items = await svc.list_for_program(
        workspace_id,
        program_id,
        date_from=date_from,
        date_to=date_to,
        limit=limit,
        offset=offset,
    )
    add_pagination_headers(
        response=response,
        request=request,
        total=total,
        limit=limit,
        offset=offset,
    )
    return items


@router.post(
    "/workspaces/{workspace_id}/events",
    response_model=EventOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_workspace_event(
    session: SessionDep,
    response: Response,
    workspace_id: UUID,
    body: EventCreate,
):
    assert body.content_type == ContentType.event, "Content type must be 'event'"
    svc = EventService(session)
    event = await svc.create_under_workspace(workspace_id, body)
    response.headers["Location"] = f"/events/{event.id}"
    return event


@router.post(
    "/programs/{program_id}/events",
    response_model=EventOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_program_event(
    session: SessionDep,
    response: Response,
    program_id: UUID,
    body: EventCreate,
):
    assert body.content_type == ContentType.event, "Content type must be 'event'"
    svc = EventService(session)
    event = await svc.create_under_program(program_id, body)
    response.headers["Location"] = f"/events/{event.id}"
    return event


# ----- item endpoints -----


@router.get("/events/{event_id}", response_model=EventOut)
async def get_event(session: SessionDep, event_id: UUID):
    svc = EventService(session)
    return await svc.get(event_id)


@router.patch("/events/{event_id}", response_model=EventOut)
async def update_event(session: SessionDep, event_id: UUID, body: EventUpdate):
    svc = EventService(session)
    return await svc.update(event_id, body)


@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(session: SessionDep, event_id: UUID):
    svc = EventService(session)
    await svc.delete(event_id)
    return None
