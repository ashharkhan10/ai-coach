"""
Data shape for a badge.
"""

from datetime import datetime

from pydantic import BaseModel


class BadgeOut(BaseModel):
    id: str
    name: str
    description: str
    earned_at: datetime | None  # None = not earned yet
