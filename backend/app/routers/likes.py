from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.pagination import Limit, Offset, add_pagination_headers
from app.schemas.like import LikeOut
from app.services.likes import LikeService

router = APIRouter(tags=["likes"])
SessionDep = Annotated[AsyncSession, Depends(get_session)]


# ----- collection: by content -----
@router.get("/content/{content_id}/likes", response_model=list[LikeOut])
async def list_content_likes(
    session: SessionDep,
    request: Request,
    response: Response,
    content_id: UUID,
    limit: Limit = 50,
    offset: Offset = 0,
):
    svc = LikeService(session)
    total = await svc.count_content_likes(content_id)
    items = await svc.list_for_content(content_id, limit=limit, offset=offset)
    add_pagination_headers(
        response=response,
        request=request,
        total=total,
        limit=limit,
        offset=offset,
    )
    return items


@router.post(
    "/content/{content_id}/likes",
    response_model=LikeOut,
    status_code=status.HTTP_201_CREATED,
)
async def like_content(
    session: SessionDep,
    user_id: UUID,
    content_id: UUID,
):
    svc = LikeService(session)
    comment = await svc.like_content(user_id=user_id, content_id=content_id)
    return comment


@router.delete("content/{content_id}/likes/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unlike_content(session: SessionDep, user_id: UUID, content_id: UUID) -> None:
    svc = LikeService(session)
    await svc.delete(user_id=user_id, content_id=content_id)
    return None
