from __future__ import annotations

from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, StringConstraints

from app.domain.troop_constraints import NAME_MAX, NAME_MIN

NameStr = Annotated[
    str,
    StringConstraints(min_length=NAME_MIN, max_length=NAME_MAX, strip_whitespace=True),
]


# ---- Troop ----


class TroopBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    name: NameStr
    workspace_id: UUID


class TroopCreate(TroopBase):
    pass


class TroopUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    name: NameStr | None = None
    workspace_id: UUID | None = None


class TroopOut(TroopBase):
    model_config = ConfigDict(from_attributes=True)
    id: UUID


# ---- TroopParticipation ----


class TroopParticipationBase(BaseModel):
    troop_id: UUID
    event_id: UUID


class TroopParticipationCreate(TroopParticipationBase):
    pass


class TroopParticipationOut(TroopParticipationBase):
    model_config = ConfigDict(from_attributes=True)
