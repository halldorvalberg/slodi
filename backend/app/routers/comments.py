from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.schemas.comment import CommentCreate, CommentOut, CommentUpdate
from app.services.comments import CommentService

router = APIRouter(prefix="/comments", tags=["comments"])
SessionDep = Annotated[AsyncSession, Depends(get_session)]

DEFAULT_LIMIT = Query(50, ge=1, le=200)
DEFAULT_OFFSET = Query(0, ge=0)

# ----- collection: by content -----


@router.get("/content/{content_id}", response_model=list[CommentOut])
async def list_comments_for_content(
    session: SessionDep,
    content_id: UUID,
    limit: int = DEFAULT_LIMIT,
    offset: int = DEFAULT_OFFSET,
):
    svc = CommentService(session)
    return await svc.list_for_content(content_id, limit=limit, offset=offset)


# create under content (user_id + content_id are in body per schema)
@router.post(
    "/content",
    response_model=CommentOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_comment_under_content(
    session: SessionDep,
    body: CommentCreate,
):
    svc = CommentService(session)
    return await svc.create_under_content(body)


# ----- item endpoints -----


@router.get("/{comment_id}", response_model=CommentOut)
async def get_comment(session: SessionDep, comment_id: UUID):
    svc = CommentService(session)
    return await svc.get(comment_id)


@router.patch("/{comment_id}", response_model=CommentOut)
async def update_comment(session: SessionDep, comment_id: UUID, body: CommentUpdate):
    svc = CommentService(session)
    return await svc.update(comment_id, body)


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(session: SessionDep, comment_id: UUID):
    svc = CommentService(session)
    await svc.delete(comment_id)
    return None
