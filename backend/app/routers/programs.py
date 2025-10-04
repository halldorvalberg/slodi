from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.schemas.program import ProgramCreate, ProgramOut, ProgramUpdate
from app.services.programs import ProgramService

router = APIRouter(prefix="/programs", tags=["programs"])
SessionDep = Annotated[AsyncSession, Depends(get_session)]

# ----- workspace-scoped collection endpoints -----


@router.get("/workspaces/{workspace_id}", response_model=list[ProgramOut])
async def list_programs_for_workspace(
    session: SessionDep,
    workspace_id: UUID,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    svc = ProgramService(session)
    return await svc.list_for_workspace(workspace_id, limit=limit, offset=offset)


@router.post(
    "/workspaces/{workspace_id}",
    response_model=ProgramOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_program_under_workspace(
    session: SessionDep,
    workspace_id: UUID,
    body: ProgramCreate,
):
    svc = ProgramService(session)
    return await svc.create_under_workspace(workspace_id, body)


# ----- item endpoints -----


@router.get("/{program_id}", response_model=ProgramOut)
async def get_program(session: SessionDep, program_id: UUID):
    svc = ProgramService(session)
    return await svc.get(program_id)


@router.patch("/{program_id}", response_model=ProgramOut)
async def update_program(session: SessionDep, program_id: UUID, body: ProgramUpdate):
    svc = ProgramService(session)
    return await svc.update(program_id, body)


@router.delete("/{program_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_program(session: SessionDep, program_id: UUID):
    svc = ProgramService(session)
    await svc.delete(program_id)
    return None
