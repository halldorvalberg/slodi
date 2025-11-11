from __future__ import annotations

from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.program import Program
from app.repositories.programs import ProgramRepository
from app.schemas.program import ProgramCreate, ProgramOut, ProgramUpdate


class ProgramService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repo = ProgramRepository(session)

    # workspace-scoped reads
    async def count_programs_for_workspace(self, workspace_id: UUID) -> int:
        return await self.repo.count_programs_for_workspace(workspace_id)

    async def list_for_workspace(
        self, workspace_id: UUID, *, limit: int = 50, offset: int = 0
    ) -> list[ProgramOut]:
        rows = await self.repo.list_by_workspace(workspace_id, limit=limit, offset=offset)
        return [ProgramOut.model_validate(r) for r in rows]

    async def get_in_workspace(self, program_id: UUID, workspace_id: UUID) -> ProgramOut:
        row = await self.repo.get_in_workspace(program_id, workspace_id)
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
        return ProgramOut.model_validate(row)

    # create under a workspace
    async def create_under_workspace(self, workspace_id: UUID, data: ProgramCreate) -> ProgramOut:
        program = Program(workspace_id=workspace_id, **data.model_dump())
        await self.repo.create(program)
        await self.session.commit()
        await self.session.refresh(program)
        return ProgramOut.model_validate(program)

    # item-level operations (not scoped)
    async def get(self, program_id: UUID) -> ProgramOut:
        row = await self.repo.get(program_id)
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
        return ProgramOut.model_validate(row)

    async def update(self, program_id: UUID, data: ProgramUpdate) -> ProgramOut:
        row = await self.repo.get(program_id)
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
        patch = data.model_dump(exclude_unset=True)
        for k, v in patch.items():
            setattr(row, k, v)
        await self.session.commit()
        await self.session.refresh(row)
        return ProgramOut.model_validate(row)

    async def delete(self, program_id: UUID) -> None:
        row = await self.repo.get(program_id)
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
        await self.repo.delete(program_id)
        await self.session.commit()
