"""
Turns a user's profile into a short sentence the AI can read.
Example: "Ashhar, 22 years old, 175 cm, 70 kg, goal: build muscle."
"""

from typing import TYPE_CHECKING

if TYPE_CHECKING:  # only for type hints, so tests don't need a database
    from app.models import User

GOAL_TEXT = {
    "lose_weight": "lose weight",
    "build_muscle": "build muscle",
    "stay_fit": "stay fit",
}


def describe_user(user: "User") -> str:
    parts = [user.name]
    if user.age:
        parts.append(f"{user.age} years old")
    if user.height_cm:
        parts.append(f"{round(user.height_cm)} cm")
    if user.weight_kg:
        parts.append(f"{round(user.weight_kg)} kg")
    if user.goal:
        parts.append(f"goal: {GOAL_TEXT[user.goal]}")
    return ", ".join(parts) + "."
