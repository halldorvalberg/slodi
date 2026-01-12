from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, ConfigDict


class LikeBase(BaseModel):
    user_id: UUID
    content_id: UUID


class LikeOut(LikeBase):
    model_config = ConfigDict(from_attributes=True)
    pass
