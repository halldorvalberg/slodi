from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.schemas.tag import (
    ContentTagCreate,
    ContentTagOut,
    TagCreate,
    TagOut,
    TagUpdate,
)
from app.services.tags import TagService

router = APIRouter(prefix="/tags", tags=["tags"])
SessionDep = Annotated[AsyncSession, Depends(get_session)]

DEFAULT_Q = Query(None, description="Search by tag name")
DEFAULT_LIMIT = Query(50, ge=1, le=200)
DEFAULT_OFFSET = Query(0, ge=0)

# ----- tags -----


@router.get("/", response_model=list[TagOut])
async def list_tags(
    session: SessionDep,
    q: str | None = DEFAULT_Q,
    limit: int = DEFAULT_LIMIT,
    offset: int = DEFAULT_OFFSET,
):
    svc = TagService(session)
    return await svc.list(q=q, limit=limit, offset=offset)


@router.post("/", response_model=TagOut, status_code=status.HTTP_201_CREATED)
async def create_tag(session: SessionDep, body: TagCreate):
    svc = TagService(session)
    return await svc.create(body)


@router.get("/{tag_id}", response_model=TagOut)
async def get_tag(session: SessionDep, tag_id: UUID):
    svc = TagService(session)
    return await svc.get(tag_id)


@router.patch("/{tag_id}", response_model=TagOut)
async def update_tag(session: SessionDep, tag_id: UUID, body: TagUpdate):
    svc = TagService(session)
    return await svc.update(tag_id, body)


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(session: SessionDep, tag_id: UUID):
    svc = TagService(session)
    await svc.delete(tag_id)
    return None


# ----- associations -----


@router.get("/content/{content_id}", response_model=list[TagOut])
async def list_tags_for_content(
    session: SessionDep,
    content_id: UUID,
    limit: int = DEFAULT_LIMIT,
    offset: int = DEFAULT_OFFSET,
):
    svc = TagService(session)
    return await svc.list_tags_for_content(content_id, limit=limit, offset=offset)


@router.post("/content", response_model=ContentTagOut, status_code=status.HTTP_201_CREATED)
async def add_tag_to_content(session: SessionDep, body: ContentTagCreate):
    svc = TagService(session)
    return await svc.add_tag_to_content(body)


@router.delete("/content/{content_id}/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_tag_from_content(session: SessionDep, content_id: UUID, tag_id: UUID):
    svc = TagService(session)
    await svc.remove_tag_from_content(content_id, tag_id)
    return None


@router.get("/{tag_id}/contents", response_model=list[UUID])
async def list_content_for_tag(
    session: SessionDep,
    tag_id: UUID,
    limit: int = DEFAULT_LIMIT,
    offset: int = DEFAULT_OFFSET,
):
    svc = TagService(session)
    return await svc.list_content_for_tag(tag_id, limit=limit, offset=offset)
