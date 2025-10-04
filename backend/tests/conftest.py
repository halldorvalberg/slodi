from app.settings import settings

# Prevent running tests against production
if settings.env == "production":
    raise RuntimeError("Refusing to run tests against production")

import asyncio
from collections.abc import AsyncIterator

import pytest
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app import models as m
from app.settings import settings


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
def pg_url():
    return settings.test_db_url


@pytest.fixture(scope="session")
async def engine(pg_url: str) -> AsyncIterator[AsyncEngine]:
    engine = create_async_engine(pg_url, pool_pre_ping=True)
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(m.Base.metadata.drop_all)
        await conn.run_sync(m.Base.metadata.create_all)
    try:
        yield engine
    finally:
        await engine.dispose()


@pytest.fixture
async def session(engine: AsyncEngine) -> AsyncIterator[AsyncSession]:
    maker = async_sessionmaker(engine, expire_on_commit=False)
    async with maker() as s:
        yield s
        await s.rollback()  # safety
