"""
Entry point of the backend.

This file creates the FastAPI app, allows the frontend to talk to it (CORS),
and plugs in all the route files.

Run it with:
    uvicorn app.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import FRONTEND_URL
from app.routes import health

app = FastAPI(title="AI Coach API")

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
