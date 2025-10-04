from __future__ import annotations

from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.troop import Troop
from app.repositories.troops import TroopRepository
from app.schemas.troop import (
    TroopCreate,
    TroopOut,
    TroopParticipationCreate,
    TroopParticipationOut,
    TroopUpdate,
)


class TroopService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repo = TroopRepository(session)

    # ----- troops -----

    async def list_for_workspace(
        self, workspace_id: UUID, *, limit: int = 50, offset: int = 0
    ) -> list[TroopOut]:
        rows = await self.repo.list_for_workspace(
            workspace_id, limit=limit, offset=offset
        )
        return [TroopOut.model_validate(r) for r in rows]

    async def create_under_workspace(
        self, workspace_id: UUID, data: TroopCreate
    ) -> TroopOut:
        if data.workspace_id != workspace_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="workspace_id in body does not match path parameter",
            )
        troop = Troop(**data.model_dump())  # id default from ORM
        await self.repo.create(troop)
        await self.session.commit()
        await self.session.refresh(troop)
        return TroopOut.model_validate(troop)

    async def get(self, troop_id: UUID) -> TroopOut:
        row = await self.repo.get(troop_id)
        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Troop not found"
            )
        return TroopOut.model_validate(row)

    async def get_in_workspace(self, troop_id: UUID, workspace_id: UUID) -> TroopOut:
        row = await self.repo.get_in_workspace(troop_id, workspace_id)
        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Troop not found"
            )
        return TroopOut.model_validate(row)

    async def update(self, troop_id: UUID, data: TroopUpdate) -> TroopOut:
        row = await self.repo.get(troop_id)
        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Troop not found"
            )
        patch = data.model_dump(exclude_unset=True)
        for k, v in patch.items():
            setattr(row, k, v)
        await self.session.commit()
        await self.session.refresh(row)
        return TroopOut.model_validate(row)

    async def delete(self, troop_id: UUID) -> None:
        deleted = await self.repo.delete(troop_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Troop not found"
            )
        await self.session.commit()

    # ----- participations -----

    async def list_troops_for_event(
        self, event_id: UUID, *, limit: int = 50, offset: int = 0
    ) -> list[TroopOut]:
        rows = await self.repo.list_troops_for_event(
            event_id, limit=limit, offset=offset
        )
        return [TroopOut.model_validate(r) for r in rows]

    async def list_events_for_troop(
        self, troop_id: UUID, *, limit: int = 50, offset: int = 0
    ) -> list[UUID]:
        return list(
            await self.repo.list_events_for_troop(troop_id, limit=limit, offset=offset)
        )

    async def add_participation(
        self, data: TroopParticipationCreate
    ) -> TroopParticipationOut:
        try:
            tp = await self.repo.add_participation(data.troop_id, data.event_id)
            await self.session.commit()
        except IntegrityError:
            await self.session.rollback()
            # duplicate composite key or missing FK
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Participation already exists or violates constraints",
            ) from None
        return TroopParticipationOut.model_validate(tp)

    async def remove_participation(self, troop_id: UUID, event_id: UUID) -> None:
        deleted = await self.repo.remove_participation(troop_id, event_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Participation not found"
            )
        await self.session.commit()
