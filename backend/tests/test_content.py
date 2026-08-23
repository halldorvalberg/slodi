from __future__ import annotations

import datetime as dt
from uuid import uuid4

import pytest

from app import models as m
from app.models.like import UserLikedContent
from app.repositories.content import ContentRepository
from app.utils import get_current_datetime


async def _workspace(db) -> tuple[m.User, m.Workspace]:
    user = m.User(name="C User", auth0_id=f"auth0|{uuid4()}", email=f"{uuid4()}@test.com")
    ws = m.Workspace(
        name="C WS",
        default_meeting_weekday=m.Weekday.monday,
        default_start_time=dt.time(20, 0),
        default_end_time=dt.time(21, 0),
        default_interval=m.EventInterval.weekly,
        season_start=dt.date.today(),
    )
    db.add_all([user, ws])
    await db.flush()
    return user, ws


@pytest.mark.integration
@pytest.mark.asyncio
async def test_list_by_workspace_returns_all_three_types(db):
    user, ws = await _workspace(db)
    now = get_current_datetime()

    program = m.Program(
        name="A Program",
        created_at=now,
        author_id=user.id,
        workspace_id=ws.id,
        content_type=m.ContentType.program,
    )
    event = m.Event(
        name="An Event",
        created_at=now,
        author_id=user.id,
        workspace_id=ws.id,
        content_type=m.ContentType.event,
        start_dt=now,
    )
    task = m.Task(
        name="A Task",
        created_at=now,
        author_id=user.id,
        workspace_id=ws.id,
        content_type=m.ContentType.task,
    )
    db.add_all([program, event, task])
    await db.flush()

    rows = await ContentRepository(db).list_by_workspace(ws.id, user.id)

    by_name = {item.name: item for item, _ in rows}
    assert set(by_name) == {"A Program", "An Event", "A Task"}

    # Each row must come back as its concrete subclass, with subclass columns
    # loaded — this is what the polymorphic select buys us.
    assert isinstance(by_name["A Program"], m.Program)
    assert isinstance(by_name["An Event"], m.Event)
    assert isinstance(by_name["A Task"], m.Task)
    assert by_name["An Event"].start_dt is not None
    assert by_name["A Task"].event_id is None

    assert by_name["A Program"].content_type == m.ContentType.program
    assert by_name["An Event"].content_type == m.ContentType.event
    assert by_name["A Task"].content_type == m.ContentType.task


@pytest.mark.integration
@pytest.mark.asyncio
async def test_list_by_workspace_excludes_soft_deleted_and_other_workspaces(db):
    user, ws = await _workspace(db)
    _, other_ws = await _workspace(db)
    now = get_current_datetime()

    live = m.Task(
        name="Live",
        created_at=now,
        author_id=user.id,
        workspace_id=ws.id,
        content_type=m.ContentType.task,
    )
    deleted = m.Task(
        name="Deleted",
        created_at=now,
        author_id=user.id,
        workspace_id=ws.id,
        content_type=m.ContentType.task,
        deleted_at=now,
    )
    elsewhere = m.Task(
        name="Elsewhere",
        created_at=now,
        author_id=user.id,
        workspace_id=other_ws.id,
        content_type=m.ContentType.task,
    )
    db.add_all([live, deleted, elsewhere])
    await db.flush()

    rows = await ContentRepository(db).list_by_workspace(ws.id, user.id)

    assert [item.name for item, _ in rows] == ["Live"]


@pytest.mark.integration
@pytest.mark.asyncio
async def test_list_by_workspace_carries_stats_and_respects_paging(db):
    user, ws = await _workspace(db)
    now = get_current_datetime()

    liked = m.Task(
        name="Liked",
        created_at=now,
        author_id=user.id,
        workspace_id=ws.id,
        content_type=m.ContentType.task,
    )
    db.add(liked)
    await db.flush()
    db.add(UserLikedContent(user_id=user.id, content_id=liked.id))
    db.add(m.Comment(content_id=liked.id, user_id=user.id, body="hi", created_at=now))
    await db.flush()

    rows = await ContentRepository(db).list_by_workspace(ws.id, user.id)
    _, stats = rows[0]
    assert stats.like_count == 1
    assert stats.comment_count == 1
    assert stats.liked_by_me is True

    # A different viewer has not liked it.
    rows_other = await ContentRepository(db).list_by_workspace(ws.id, uuid4())
    assert rows_other[0][1].liked_by_me is False

    assert await ContentRepository(db).count_by_workspace(ws.id) == 1
    assert await ContentRepository(db).list_by_workspace(ws.id, user.id, limit=0) == []


@pytest.mark.integration
@pytest.mark.asyncio
async def test_get_resolves_any_type_and_skips_deleted(db):
    user, ws = await _workspace(db)
    now = get_current_datetime()

    task = m.Task(
        name="Findable",
        created_at=now,
        author_id=user.id,
        workspace_id=ws.id,
        content_type=m.ContentType.task,
    )
    gone = m.Event(
        name="Gone",
        created_at=now,
        author_id=user.id,
        workspace_id=ws.id,
        content_type=m.ContentType.event,
        start_dt=now,
        deleted_at=now,
    )
    db.add_all([task, gone])
    await db.flush()

    repo = ContentRepository(db)

    found = await repo.get(task.id, user.id)
    assert found is not None
    assert isinstance(found[0], m.Task)
    assert found[0].content_type == m.ContentType.task

    assert await repo.get(gone.id, user.id) is None
    assert await repo.get(uuid4(), user.id) is None
