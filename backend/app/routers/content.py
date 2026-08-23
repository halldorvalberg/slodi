# ruff: noqa: B008
from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import check_workspace_access, get_current_user
from app.core.db import get_session
from app.core.pagination import Limit, Offset, add_pagination_headers
from app.schemas.content import ContentListOut, ContentOut
from app.schemas.user import UserOut
from app.schemas.workspace import WorkspaceRole
from app.services.content import ContentService

router = APIRouter(tags=["content"])
SessionDep = Annotated[AsyncSession, Depends(get_session)]


@router.get("/workspaces/{workspace_id}/content", response_model=list[ContentListOut])
async def list_workspace_content(
    session: SessionDep,
    request: Request,
    response: Response,
    workspace_id: UUID,
    current_user: UserOut = Depends(get_current_user),
    limit: Limit = 50,
    offset: Offset = 0,
) -> list[ContentListOut]:
    svc = ContentService(session)
    await check_workspace_access(
        workspace_id, current_user, session, minimum_role=WorkspaceRole.viewer
    )

    total = await svc.count_for_workspace(workspace_id)
    items = await svc.list_for_workspace(workspace_id, current_user.id, limit=limit, offset=offset)
    add_pagination_headers(
        response=response,
        request=request,
        total=total,
        limit=limit,
        offset=offset,
    )
    return items


@router.get("/content/{content_id}", response_model=ContentOut)
async def get_content(
    session: SessionDep,
    content_id: UUID,
    response: Response,
    current_user: UserOut = Depends(get_current_user),
) -> ContentOut:
    svc = ContentService(session)
    item = await svc.get(content_id, current_user.id)
    await check_workspace_access(
        item.workspace_id,
        current_user,
        session,
        minimum_role=WorkspaceRole.viewer,
        hide_from_non_members=True,
    )
    response.headers["Cache-Control"] = "private, max-age=60"
    return item
