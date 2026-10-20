"""
Health check route.

GET /health simply answers {"status": "ok"}.
Used to check the backend is running, and by cron-job.org to keep it awake.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok"}
