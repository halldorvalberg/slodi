from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.email_list import EmailList
from app.repositories.email_list import EmailListRepository
from app.schemas.email_list import EmailListCreate, EmailListOut


class EmailListService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repo = EmailListRepository(session)

    async def list(self) -> list[EmailListOut]:
        rows = await self.repo.list()
        return [EmailListOut.model_validate(r) for r in rows]

    async def create(self, data: EmailListCreate) -> EmailListOut:
        email_entry = EmailList(**data.model_dump())
        try:
            await self.repo.create(email_entry)
            await self.session.commit()
        except IntegrityError:
            await self.session.rollback()
            # Email unique violation
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This email is already subscribed",
            ) from None
        await self.session.refresh(email_entry)
        return EmailListOut.model_validate(email_entry)

    async def delete(self, email: str) -> None:
        deleted_count = await self.repo.delete(email)
        if deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email not found in subscription list",
            )
        await self.session.commit()
