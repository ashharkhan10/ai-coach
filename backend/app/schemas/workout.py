"""
Data shapes for saving and reading workouts.
"""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.schemas.badge import BadgeOut

ExerciseId = Literal["squat", "pushup", "curl", "press", "lunge"]


# ---------- coming IN (from the browser) ----------


class SetIn(BaseModel):
    set_number: int = Field(ge=1, le=10)
    reps: int = Field(ge=0, le=50)
    duration_sec: int = Field(ge=0, le=3600)
    form_score: int = Field(ge=0, le=100)
    main_issue: str | None = Field(default=None, max_length=200)


class WorkoutIn(BaseModel):
    exercise: ExerciseId
    target_sets: int = Field(ge=1, le=10)
    target_reps: int = Field(ge=1, le=50)
    started_at: datetime
    ended_at: datetime
    sets: list[SetIn] = Field(min_length=1, max_length=10)
    # From the browser: minutes between UTC and the user's local time
    # (JavaScript's getTimezoneOffset, e.g. -330 for India). Used for streaks.
    tz_offset_minutes: int = Field(default=0, ge=-840, le=840)

    @model_validator(mode="after")
    def end_after_start(self):
        if self.ended_at < self.started_at:
            raise ValueError("ended_at must be after started_at")
        return self


# ---------- going OUT (to the browser) ----------


class SetOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    set_number: int
    reps: int
    duration_sec: int
    form_score: int
    main_issue: str | None


class WorkoutOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    exercise: str
    target_sets: int
    target_reps: int
    started_at: datetime
    ended_at: datetime
    total_reps: int
    duration_sec: int
    sets: list[SetOut]


class WorkoutSavedResponse(BaseModel):
    workout: WorkoutOut
    new_badges: list[BadgeOut]  # badges unlocked by this workout
