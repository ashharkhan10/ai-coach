"""
Database tables. Import every model here so they're all created at startup.
"""

from app.models.badge import UserBadge
from app.models.user import User
from app.models.workout import SessionSet, WorkoutSession

__all__ = ["SessionSet", "User", "UserBadge", "WorkoutSession"]
