from __future__ import annotations

from collections.abc import AsyncIterator
from functools import lru_cache

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.settings import settings


@lru_cache
def get_engine(url: str | None = None) -> AsyncEngine:
    db_url = url or settings.db_url
    return create_async_engine(db_url, pool_pre_ping=True)


def get_session_maker(
    engine: AsyncEngine | None = None,
) -> async_sessionmaker[AsyncSession]:
    engine = engine or get_engine()
    return async_sessionmaker(engine, expire_on_commit=False)


async def get_session() -> AsyncIterator[AsyncSession]:
    async_session = get_session_maker()
    async with async_session() as session:
        yield session
