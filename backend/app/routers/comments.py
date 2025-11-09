from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.pagination import Limit, Offset, add_pagination_headers
from app.schemas.comment import CommentCreate, CommentOut, CommentUpdate
from app.services.comments import CommentService

router = APIRouter(tags=["comments"])
SessionDep = Annotated[AsyncSession, Depends(get_session)]

# ----- collection: by content -----


@router.get("/content/{content_id}/comments", response_model=list[CommentOut])
async def list_content_comments(
    session: SessionDep,
    request: Request,
    response: Response,
    content_id: UUID,
    limit: Limit = 50,
    offset: Offset = 0,
):
    svc = CommentService(session)
    total = await svc.count_content_comments(content_id)
    items = await svc.list_for_content(content_id, limit=limit, offset=offset)
    add_pagination_headers(
        response=response,
        request=request,
        total=total,
        limit=limit,
        offset=offset,
    )
    return items


# create under content (user_id is in body per schema)
@router.post(
    "/content/{content_id}/comments",
    response_model=CommentOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_comment_under_content(
    session: SessionDep,
    content_id: UUID,
    body: CommentCreate,
    response: Response,
):
    svc = CommentService(session)
    comment = await svc.create_under_content(content_id, body)
    response.headers["Location"] = f"/comments/{comment.id}"
    return comment


# ----- item endpoints -----


@router.get("/comments/{comment_id}", response_model=CommentOut)
async def get_comment(session: SessionDep, comment_id: UUID):
    svc = CommentService(session)
    return await svc.get(comment_id)


@router.patch("/comments/{comment_id}", response_model=CommentOut)
async def update_comment(session: SessionDep, comment_id: UUID, body: CommentUpdate):
    svc = CommentService(session)
    return await svc.update(comment_id, body)


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(session: SessionDep, comment_id: UUID):
    svc = CommentService(session)
    await svc.delete(comment_id)
    return None
