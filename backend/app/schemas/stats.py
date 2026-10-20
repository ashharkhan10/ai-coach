"""
Data shapes for the history screen's numbers and charts.
"""

from datetime import date

from pydantic import BaseModel


class DayProgress(BaseModel):
    day: date
    reps: int
    avg_form: int | None  # None = no workout that day


class StatsOut(BaseModel):
    week_reps: int
    week_sets: int
    week_minutes: int
    streak_days: int
    daily: list[DayProgress]  # last 14 days, oldest first
