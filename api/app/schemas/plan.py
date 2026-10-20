"""
The shape of a weekly workout plan, and the options the user picks.

The AI must reply in exactly the PlanContent shape. If it doesn't,
Pydantic rejects it, so a broken plan never reaches the user.
"""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

from app.schemas.workout import ExerciseId

Weekday = Literal["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
WEEK_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

Level = Literal["beginner", "intermediate", "advanced"]
SessionMinutes = Literal[10, 20, 30]


# ---------- what the user picks ----------


class PlanOptions(BaseModel):
    weekdays: list[Weekday] = Field(min_length=2, max_length=6)  # also sets days per week
    level: Level = "beginner"
    exercises: list[ExerciseId] = Field(min_length=1, max_length=5)
    minutes: SessionMinutes = 20

    @field_validator("weekdays")
    @classmethod
    def unique_and_in_order(cls, days: list[str]) -> list[str]:
        return sorted(set(days), key=WEEK_ORDER.index)

    @field_validator("exercises")
    @classmethod
    def unique_exercises(cls, exercises: list[str]) -> list[str]:
        return list(dict.fromkeys(exercises))  # removes repeats, keeps order


# ---------- what the AI sends back ----------


class PlannedExercise(BaseModel):
    exercise: ExerciseId
    sets: int = Field(ge=1, le=10)
    reps: int = Field(ge=1, le=50)


class PlanDay(BaseModel):
    day: Weekday
    focus: str = Field(max_length=60)  # e.g. "Lower body"
    exercises: list[PlannedExercise] = Field(min_length=1, max_length=5)


class PlanContent(BaseModel):
    title: str = Field(max_length=80)
    summary: str = Field(max_length=300)
    days: list[PlanDay] = Field(min_length=2, max_length=6)
    tip: str = Field(max_length=200)


# ---------- what the browser gets ----------


class PlanOut(BaseModel):
    id: int
    created_at: datetime
    plan: PlanContent
    options: PlanOptions | None  # None for plans made before options existed
