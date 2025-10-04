from __future__ import annotations

from collections.abc import Sequence
from typing import Any, TypeVar

from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession

T = TypeVar("T")


class Repository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def add(self, instance: T) -> T:
        self.session.add(instance)
        return instance

    async def scalars(self, stmt: Select[Any]) -> Sequence[Any]:
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def scalar_one(self, stmt: Select[Any]) -> Any:
        result = await self.session.execute(stmt)
        return result.scalars().one()
