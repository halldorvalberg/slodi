# app/main.py
from __future__ import annotations

from fastapi import FastAPI

from app.core.logging import configure_logging
from app.routers import (
    comments_router,
    events_router,
    groups_router,
    programs_router,
    tags_router,
    tasks_router,
    troops_router,
    users_router,
    workspaces_router,
)


def create_app() -> FastAPI:
    configure_logging()
    app = FastAPI(title="Backend API")

    app.include_router(users_router.router)
    app.include_router(groups_router.router)
    app.include_router(workspaces_router.router)
    app.include_router(troops_router.router)
    app.include_router(programs_router.router)
    app.include_router(events_router.router)
    app.include_router(tasks_router.router)
    app.include_router(tags_router.router)
    app.include_router(comments_router.router)

    @app.get("/healthz")
    async def healthz():
        return {"ok": True}

    return app


app = create_app()
