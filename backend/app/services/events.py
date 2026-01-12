from __future__ import annotations

import datetime as dt
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.event import Event
from app.repositories.events import EventRepository
from app.repositories.programs import ProgramRepository
from app.schemas.event import EventCreate, EventOut, EventUpdate


class EventService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repo = EventRepository(session)
        self.program_repo = ProgramRepository(session)

    # ----- workspace/program scoped listing -----
    async def count_events_for_workspace(
        self,
        workspace_id: UUID,
        *,
        date_from: dt.datetime | None = None,
        date_to: dt.datetime | None = None,
    ) -> int:
        return await self.repo.count_for_workspace(
            workspace_id, date_from=date_from, date_to=date_to
        )

    async def list_for_workspace(
        self,
        workspace_id: UUID,
        *,
        date_from: dt.datetime | None = None,
        date_to: dt.datetime | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[EventOut]:
        rows = await self.repo.list_for_workspace(
            workspace_id,
            date_from=date_from,
            date_to=date_to,
            limit=limit,
            offset=offset,
        )
        return [EventOut.model_validate(r) for r in rows]

    async def count_events_for_program(
        self,
        workspace_id: UUID,
        program_id: UUID,
        *,
        date_from: dt.datetime | None = None,
        date_to: dt.datetime | None = None,
    ) -> int:
        return await self.repo.count_for_program(
            workspace_id, program_id, date_from=date_from, date_to=date_to
        )

    async def list_for_program(
        self,
        workspace_id: UUID,
        program_id: UUID,
        *,
        date_from: dt.datetime | None = None,
        date_to: dt.datetime | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[EventOut]:
        rows = await self.repo.list_for_program(
            workspace_id,
            program_id,
            date_from=date_from,
            date_to=date_to,
            limit=limit,
            offset=offset,
        )
        return [EventOut.model_validate(r) for r in rows]

    # ----- creation under workspace/program -----

    async def create_under_workspace(self, workspace_id: UUID, data: EventCreate) -> EventOut:
        event = Event(workspace_id=workspace_id, program_id=None, **data.model_dump())
        await self.repo.create(event)
        await self.session.commit()
        await self.session.refresh(event)
        return EventOut.model_validate(event)

    async def create_under_program(self, program_id: UUID, data: EventCreate) -> EventOut:
        program = await self.program_repo.get(program_id)
        if not program:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
        event = Event(
            workspace_id=program.workspace_id,
            program_id=program.id,
            **data.model_dump(),
        )
        await self.repo.create(event)
        await self.session.commit()
        await self.session.refresh(event)
        return EventOut.model_validate(event)

    # ----- item operations -----

    async def get(self, event_id: UUID) -> EventOut:
        row = await self.repo.get(event_id)
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
        return EventOut.model_validate(row)

    async def get_in_program(
        self, event_id: UUID, program_id: UUID, workspace_id: UUID
    ) -> EventOut:
        row = await self.repo.get_in_program(event_id, program_id, workspace_id)
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
        return EventOut.model_validate(row)

    async def update(self, event_id: UUID, data: EventUpdate) -> EventOut:
        row = await self.repo.get(event_id)
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
        if data.program_id is not None:
            program = await self.program_repo.get(data.program_id)
            if not program:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Program not found"
                )
            if program.workspace_id != row.workspace_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Program does not belong to the same workspace as the event",
                )
            row.program_id = program.id
        elif data.program_id is None:
            row.program_id = None
        patch = data.model_dump(exclude_unset=True)
        for k, v in patch.items():
            setattr(row, k, v)
        await self.session.commit()
        await self.session.refresh(row)
        return EventOut.model_validate(row)

    async def delete(self, event_id: UUID) -> None:
        row = await self.repo.get(event_id)
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
        await self.repo.delete(event_id)
        await self.session.commit()
