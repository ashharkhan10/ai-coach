"""
Data shapes for the user's profile.
"""

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Goal = Literal["lose_weight", "build_muscle", "stay_fit"]


class UserOut(BaseModel):
    """What the API sends back about a user. Never includes the password."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    name: str
    age: int | None
    height_cm: float | None
    weight_kg: float | None
    goal: Goal | None


class ProfileUpdate(BaseModel):
    """What the user can change on the profile page."""

    name: str = Field(min_length=1, max_length=100)
    age: int | None = Field(default=None, ge=10, le=100)
    height_cm: float | None = Field(default=None, ge=100, le=250)
    weight_kg: float | None = Field(default=None, ge=25, le=300)
    goal: Goal | None = None
