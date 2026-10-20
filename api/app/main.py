"""
Entry point of the backend.

This file creates the FastAPI app, allows the frontend to talk to it (CORS),
creates the database tables, and plugs in all the route files.

Run it with:
    uvicorn app.main:app --reload
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401  (loads every table so create_all sees them)
from app.config import FRONTEND_URL
from app.database import Base, engine
from app.routes import auth, health, profile


@asynccontextmanager
async def lifespan(app: FastAPI):
    # On startup: create any tables that don't exist yet.
    Base.metadata.create_all(engine)
    yield


app = FastAPI(title="AI Coach API", lifespan=lifespan)

# Allow the Next.js frontend to call this backend from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Plug in each group of routes.
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(profile.router)
