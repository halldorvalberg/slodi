from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.schemas.group import (
    GroupCreate,
    GroupMembershipCreate,
    GroupMembershipOut,
    GroupMembershipUpdate,
    GroupOut,
    GroupUpdate,
)
from app.services.groups import GroupService

router = APIRouter(prefix="/groups", tags=["groups"])
SessionDep = Annotated[AsyncSession, Depends(get_session)]

DEFAULT_Q = Query(None, description="Search by group name")
DEFAULT_LIMIT = Query(50, ge=1, le=200)
DEFAULT_OFFSET = Query(0, ge=0)

# ----- groups -----


@router.get("/", response_model=list[GroupOut])
async def list_groups(
    session: SessionDep,
    q: str | None = DEFAULT_Q,
    limit: int = DEFAULT_LIMIT,
    offset: int = DEFAULT_OFFSET,
):
    svc = GroupService(session)
    return await svc.list(q=q, limit=limit, offset=offset)


@router.post("/", response_model=GroupOut, status_code=status.HTTP_201_CREATED)
async def create_group(session: SessionDep, body: GroupCreate):
    svc = GroupService(session)
    return await svc.create(body)


@router.get("/{group_id}", response_model=GroupOut)
async def get_group(session: SessionDep, group_id: UUID):
    svc = GroupService(session)
    return await svc.get(group_id)


@router.patch("/{group_id}", response_model=GroupOut)
async def update_group(session: SessionDep, group_id: UUID, body: GroupUpdate):
    svc = GroupService(session)
    return await svc.update(group_id, body)


@router.delete("/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_group(session: SessionDep, group_id: UUID):
    svc = GroupService(session)
    await svc.delete(group_id)
    return None


# ----- memberships -----


@router.get("/{group_id}/memberships", response_model=list[GroupMembershipOut])
async def list_group_memberships(
    session: SessionDep,
    group_id: UUID,
    limit: int = DEFAULT_LIMIT,
    offset: int = DEFAULT_OFFSET,
):
    svc = GroupService(session)
    return await svc.list_members(group_id, limit=limit, offset=offset)


@router.post(
    "/{group_id}/memberships",
    response_model=GroupMembershipOut,
    status_code=status.HTTP_201_CREATED,
)
async def add_group_member(
    session: SessionDep, group_id: UUID, body: GroupMembershipCreate
):
    svc = GroupService(session)
    return await svc.add_member(group_id, body)


@router.patch(
    "/{group_id}/memberships/{user_id}",
    response_model=GroupMembershipOut,
)
async def update_group_member(
    session: SessionDep,
    group_id: UUID,
    user_id: UUID,
    body: GroupMembershipUpdate,
):
    svc = GroupService(session)
    return await svc.update_member(group_id, user_id, body)


@router.delete(
    "/{group_id}/memberships/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def remove_group_member(session: SessionDep, group_id: UUID, user_id: UUID):
    svc = GroupService(session)
    await svc.remove_member(group_id, user_id)
    return None
