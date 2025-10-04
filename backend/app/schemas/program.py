from __future__ import annotations

from typing import Annotated, Literal
from uuid import UUID

from pydantic import ConfigDict, StringConstraints

from app.domain.program_constraints import IMG_MAX
from app.models.content import ContentType

from .content import ContentCreate, ContentOut, ContentUpdate

ImageStr = Annotated[
    str, StringConstraints(min_length=0, max_length=IMG_MAX, strip_whitespace=True)
]


class ProgramCreate(ContentCreate):
    content_type: Literal[ContentType.program] = ContentType.program
    workspace_id: UUID
    image: ImageStr | None = None


class ProgramUpdate(ContentUpdate):
    workspace_id: UUID | None = None
    image: ImageStr | None = None


class ProgramOut(ContentOut):
    model_config = ConfigDict(from_attributes=True)

    image: ImageStr | None = None
    workspace_id: UUID
