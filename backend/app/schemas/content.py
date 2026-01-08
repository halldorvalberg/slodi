from __future__ import annotations

import datetime as dt
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, field_validator

from app.domain.content_constraints import DESC_MAX, NAME_MAX, NAME_MIN
from app.utils import get_current_datetime

NameStr = Annotated[
    str,
    StringConstraints(min_length=NAME_MIN, max_length=NAME_MAX, strip_whitespace=True),
]
DescStr = Annotated[
    str, StringConstraints(min_length=0, max_length=DESC_MAX, strip_whitespace=True)
]


class ContentBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: NameStr
    description: DescStr | None = None
    public: bool = False
    like_count: int = 0
    created_at: dt.datetime = Field(default_factory=get_current_datetime)
    author_id: UUID

    @field_validator("like_count")
    @classmethod
    def validate_like_count(cls, v: int) -> int:
        if v < 0:
            raise ValueError("like_count must be >= 0")
        return v


class ContentCreate(ContentBase):
    # Override author_id to make it optional - backend sets this from authenticated user
    author_id: UUID | None = None
    # Override like_count and created_at with defaults
    like_count: int = 0
    created_at: dt.datetime = Field(default_factory=get_current_datetime)


class ContentUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: NameStr | None = None
    description: DescStr | None = None
    public: bool | None = None
    like_count: int | None = None

    @field_validator("like_count")
    @classmethod
    def validate_like_count(cls, v: int | None) -> int | None:
        if v is not None and v < 0:
            raise ValueError("like_count must be >= 0")
        return v


class ContentOut(ContentBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
