"""
Data shapes for the live voice coach.
"""

from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.workout import ExerciseId

CoachEvent = Literal["workout_started", "form_issue", "set_completed", "workout_completed"]


class CoachRequest(BaseModel):
    event: CoachEvent
    exercise: ExerciseId
    issue: str | None = Field(default=None, max_length=200)  # for form_issue / set_completed
    set_number: int | None = Field(default=None, ge=1, le=10)
    total_sets: int | None = Field(default=None, ge=1, le=10)
    reps: int | None = Field(default=None, ge=0, le=500)
    form_score: int | None = Field(default=None, ge=0, le=100)


class CoachReply(BaseModel):
    text: str
