import datetime as dt

import pytest
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app import models as m
from app import schemas as s
from app.utils import get_current_datetime


@pytest.mark.asyncio
async def test_user_workspace_program_event_task_flow(session):
    # 1) Create a user (ORM normalization lowers email)
    u_in = s.UserCreate(name="Jane", auth0_id="auth0|1", email="JANE@EXAMPLE.COM")
    user = m.User(
        name=u_in.name,
        auth0_id=u_in.auth0_id,
        email=u_in.email,
        pronouns=m.Pronouns.she_her,
    )
    session.add(user)

    # 2) Create a workspace
    w_in = s.WorkspaceCreate(name="Pack 42")
    workspace = m.Workspace(
        name=w_in.name,
        default_meeting_weekday=w_in.default_meeting_weekday,
        default_start_time=w_in.default_start_time,
        default_end_time=w_in.default_end_time,
        default_interval=w_in.default_interval,
        season_start=w_in.season_start,
        settings=w_in.settings,
        group_id=w_in.group_id,
    )
    session.add(workspace)
    await session.flush()

    # 3) Program (joined-table child of content)
    p_in = s.ProgramCreate(
        name="Fall Skills",
        description=None,
        public=False,
        like_count=0,
        created_at=get_current_datetime(),
        author_id=user.id,
        workspace_id=workspace.id,
    )
    program = m.Program(**p_in.model_dump())
    session.add(program)
    await session.flush()

    # Ensure Content row exists & polymorphic identity set
    row = await session.scalar(select(m.Content).where(m.Content.id == program.id))
    assert row is not None and row.content_type == m.ContentType.program

    # 4) Event under program
    e_in = s.EventCreate(
        name="Campout",
        description="Overnight",
        public=False,
        like_count=0,
        created_at=get_current_datetime(),
        author_id=user.id,
        workspace_id=workspace.id,
        program_id=program.id,
    )
    event = m.Event(**e_in.model_dump())
    session.add(event)
    await session.flush()

    # 5) Task under event
    t_in = s.TaskCreate(
        name="Setup tents",
        description=None,
        public=False,
        like_count=0,
        created_at=get_current_datetime(),
        author_id=user.id,
        event_id=event.id,
    )
    task = m.Task(**t_in.model_dump())
    session.add(task)
    await session.commit()

    # 6) Load back and traverse relationships
    loaded = await session.execute(
        select(m.Program)
        .options(
            selectinload(m.Program.workspace),
            selectinload(m.Program.events).selectinload(m.Event.tasks),
        )
        .where(m.Program.id == program.id)
    )
    db_program = loaded.scalar_one()
    assert db_program.workspace.id == workspace.id
    assert len(db_program.events) == 1
    assert db_program.events[0].tasks[0].id == task.id


@pytest.mark.asyncio
async def test_tags_and_comments_and_cascade(session):
    # Create content program quickly
    u = m.User(name="A", auth0_id="auth0|x", email="a@x.com")
    ws = m.Workspace(
        name="WS",
        default_meeting_weekday=m.Weekday.monday,
        default_start_time=dt.time(20, 0),
        default_end_time=dt.time(21, 0),
        default_interval=m.EventInterval.weekly,
        season_start=dt.date.today(),
        settings=None,
        group_id=None,
    )
    session.add_all([u, ws])
    await session.flush()

    p = m.Program(
        name="Prog",
        description=None,
        public=False,
        like_count=0,
        created_at=get_current_datetime(),
        author_id=u.id,
        workspace_id=ws.id,
        content_type=m.ContentType.program,
    )
    session.add(p)
    await session.flush()

    # Tag + association
    tag = m.Tag(name="outdoors")
    session.add(tag)
    await session.flush()

    ct = m.ContentTag(content_id=p.id, tag_id=tag.id)
    session.add(ct)

    # Comment
    c_in = s.CommentCreate(body="Nice idea!", user_id=u.id, content_id=p.id)
    comment = m.Comment(**c_in.model_dump())
    session.add(comment)
    await session.commit()

    # Verify associations exist
    tags = await session.execute(
        select(m.Tag).join(m.ContentTag).where(m.ContentTag.content_id == p.id)
    )
    assert tags.scalars().one().name == "outdoors"

    comments = await session.execute(select(m.Comment).where(m.Comment.content_id == p.id))
    assert comments.scalars().one().body == "Nice idea!"

    # Delete CONTENT parent; ensure cascade to Program (child) via ondelete
    content_row = await session.scalar(select(m.Content).where(m.Content.id == p.id))
    await session.delete(content_row)
    await session.commit()

    # Program should be gone
    gone = await session.scalar(select(m.Program).where(m.Program.id == p.id))
    assert gone is None

    # ContentTag/comment referencing the content should also be gone (FK ondelete CASCADE)
    tag_links = await session.execute(select(m.ContentTag).where(m.ContentTag.content_id == p.id))
    assert tag_links.first() is None

    comms = await session.execute(select(m.Comment).where(m.Comment.content_id == p.id))
    assert comms.first() is None


@pytest.mark.asyncio
async def test_group_membership_and_troops(session):
    # Group, User, Workspace
    g = m.Group(name="Parents")
    u = m.User(name="B", auth0_id="auth0|2", email="b@example.com")
    ws = m.Workspace(
        name="WS2",
        default_meeting_weekday=m.Weekday.monday,
        default_start_time=dt.time(20, 0),
        default_end_time=dt.time(21, 0),
        default_interval=m.EventInterval.weekly,
        season_start=dt.date.today(),
        settings=None,
        group_id=None,
    )
    session.add_all([g, u, ws])
    await session.flush()

    # Membership
    gm = m.GroupMembership(user_id=u.id, group_id=g.id, role=m.GroupRole.viewer)
    session.add(gm)

    # Troop and participation on an event
    p = m.Program(
        name="Prog2",
        description=None,
        public=False,
        like_count=0,
        created_at=get_current_datetime(),
        author_id=u.id,
        workspace_id=ws.id,
        content_type=m.ContentType.program,
    )
    e = m.Event(
        name="Hike",
        description=None,
        public=False,
        like_count=0,
        created_at=get_current_datetime(),
        author_id=u.id,
        workspace_id=ws.id,
        program=p,
        content_type=m.ContentType.event,
        start_dt=get_current_datetime(),
        end_dt=None,
    )
    tr = m.Troop(name="Foxes", workspace_id=ws.id)
    session.add_all([p, e, tr])
    await session.flush()

    tp = m.TroopParticipation(troop_id=tr.id, event_id=e.id)
    session.add(tp)
    await session.commit()

    # Simple fetches
    res = await session.execute(select(m.Group).where(m.Group.id == g.id))
    assert res.scalar_one().name == "Parents"

    res = await session.execute(
        select(m.TroopParticipation).where(m.TroopParticipation.troop_id == tr.id)
    )
    assert res.scalar_one().event_id == e.id
