from __future__ import annotations

from collections.abc import Sequence
from uuid import UUID

from sqlalchemy import Select, and_, delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.troop import Troop, TroopParticipation
from app.repositories.base import Repository


class TroopRepository(Repository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session)

    # ----- troops -----

    async def get(self, troop_id: UUID) -> Troop | None:
        stmt: Select[tuple[Troop]] = (
            select(Troop)
            .options(
                selectinload(Troop.workspace),
                selectinload(Troop.troop_participations),
            )
            .where(Troop.id == troop_id)
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def get_in_workspace(
        self, troop_id: UUID, workspace_id: UUID
    ) -> Troop | None:
        stmt = select(Troop).where(
            Troop.id == troop_id, Troop.workspace_id == workspace_id
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def list_for_workspace(
        self, workspace_id: UUID, *, limit: int = 50, offset: int = 0
    ) -> Sequence[Troop]:
        stmt = (
            select(Troop)
            .where(Troop.workspace_id == workspace_id)
            .order_by(Troop.name)
            .limit(limit)
            .offset(offset)
        )
        return await self.scalars(stmt)

    async def create(self, troop: Troop) -> Troop:
        await self.add(troop)
        return troop

    async def delete(self, troop_id: UUID) -> int:
        res = await self.session.execute(delete(Troop).where(Troop.id == troop_id))
        return res.rowcount or 0

    # ----- participations -----

    async def list_troops_for_event(
        self, event_id: UUID, *, limit: int = 50, offset: int = 0
    ) -> Sequence[Troop]:
        stmt = (
            select(Troop)
            .join(TroopParticipation, TroopParticipation.troop_id == Troop.id)
            .where(TroopParticipation.event_id == event_id)
            .order_by(Troop.name)
            .limit(limit)
            .offset(offset)
        )
        return await self.scalars(stmt)

    async def list_events_for_troop(
        self, troop_id: UUID, *, limit: int = 50, offset: int = 0
    ) -> Sequence[UUID]:
        stmt = (
            select(TroopParticipation.event_id)
            .where(TroopParticipation.troop_id == troop_id)
            .limit(limit)
            .offset(offset)
        )
        res = await self.session.execute(stmt)
        return [row[0] for row in res.fetchall()]

    async def add_participation(
        self, troop_id: UUID, event_id: UUID
    ) -> TroopParticipation:
        tp = TroopParticipation(troop_id=troop_id, event_id=event_id)
        await self.add(tp)
        return tp

    async def remove_participation(self, troop_id: UUID, event_id: UUID) -> int:
        res = await self.session.execute(
            delete(TroopParticipation).where(
                and_(
                    TroopParticipation.troop_id == troop_id,
                    TroopParticipation.event_id == event_id,
                )
            )
        )
        return res.rowcount or 0
