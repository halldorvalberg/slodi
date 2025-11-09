from __future__ import annotations

import datetime as dt
from collections.abc import Sequence
from uuid import UUID

from sqlalchemy import and_, asc, delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.event import Event
from app.repositories.base import Repository


class EventRepository(Repository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session)

    async def get(self, event_id: UUID) -> Event | None:
        stmt = (
            select(Event)
            .options(
                selectinload(Event.workspace),
                selectinload(Event.program),
                selectinload(Event.tasks),
            )
            .where(Event.id == event_id)
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def get_in_program(
        self, event_id: UUID, program_id: UUID, workspace_id: UUID
    ) -> Event | None:
        stmt = select(Event).where(
            Event.id == event_id,
            Event.program_id == program_id,
            Event.workspace_id == workspace_id,
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def count_for_workspace(
        self,
        workspace_id: UUID,
        *,
        date_from: dt.datetime | None = None,
        date_to: dt.datetime | None = None,
    ) -> int:
        conds = [Event.workspace_id == workspace_id]
        if date_from is not None:
            conds.append(Event.start_dt >= date_from)
        if date_to is not None:
            conds.append(Event.start_dt <= date_to)

        result = await self.session.scalar(
            select(func.count()).select_from(Event).where(and_(*conds))
        )
        return result or 0

    async def list_for_workspace(
        self,
        workspace_id: UUID,
        *,
        date_from: dt.datetime | None = None,
        date_to: dt.datetime | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Sequence[Event]:
        conds = [Event.workspace_id == workspace_id]
        if date_from is not None:
            conds.append(Event.start_dt >= date_from)
        if date_to is not None:
            conds.append(Event.start_dt <= date_to)

        stmt = (
            select(Event)
            .where(and_(*conds))
            .order_by(asc(Event.start_dt))
            .limit(limit)
            .offset(offset)
        )
        return await self.scalars(stmt)

    async def count_for_program(
        self,
        workspace_id: UUID,
        program_id: UUID,
        *,
        date_from: dt.datetime | None = None,
        date_to: dt.datetime | None = None,
    ) -> int:
        conds = [
            Event.workspace_id == workspace_id,
            Event.program_id == program_id,
        ]
        if date_from is not None:
            conds.append(Event.start_dt >= date_from)
        if date_to is not None:
            conds.append(Event.start_dt <= date_to)

        result = await self.session.scalar(
            select(func.count()).select_from(Event).where(and_(*conds))
        )
        return result or 0

    async def list_for_program(
        self,
        workspace_id: UUID,
        program_id: UUID,
        *,
        date_from: dt.datetime | None = None,
        date_to: dt.datetime | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Sequence[Event]:
        conds = [
            Event.workspace_id == workspace_id,
            Event.program_id == program_id,
        ]
        if date_from is not None:
            conds.append(Event.start_dt >= date_from)
        if date_to is not None:
            conds.append(Event.start_dt <= date_to)

        stmt = (
            select(Event)
            .where(and_(*conds))
            .order_by(asc(Event.start_dt))
            .limit(limit)
            .offset(offset)
        )
        return await self.scalars(stmt)

    async def create(self, event: Event) -> Event:
        await self.add(event)
        return event

    async def delete(self, event_id: UUID) -> int:
        stmt = delete(Event).where(Event.id == event_id)
        res = await self.session.execute(stmt)
        return res.rowcount or 0
