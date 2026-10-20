"""
The AI workout planner: makes a weekly plan from the user's profile,
their recent training, and the options they picked.
"""

from collections import defaultdict
from collections.abc import Sequence
from typing import TYPE_CHECKING, Protocol

from app.schemas.plan import PlanContent, PlanOptions
from app.services.coach import EXERCISE_NAMES
from app.services.profile_text import describe_user

if TYPE_CHECKING:  # only for type hints, so tests don't need a database
    from app.models import User


class _Set(Protocol):
    form_score: int


class _Workout(Protocol):
    exercise: str
    total_reps: int
    sets: Sequence[_Set]


# How hard each level is.
LEVEL_RULES = {
    "beginner": "2-3 sets per exercise, 6-12 reps",
    "intermediate": "3-4 sets per exercise, 8-15 reps",
    "advanced": "4-5 sets per exercise, 10-20 reps",
}

# How many exercises fit in a session.
EXERCISES_PER_SESSION = {10: "1-2", 20: "2-3", 30: "3-4"}

SYSTEM_PROMPT = """You are AI Coach, an expert personal trainer. Create a safe, realistic
weekly home-workout plan.

Reply with JSON only, in exactly this shape:
{
  "title": "short plan name",
  "summary": "1-2 sentences on why this plan fits the user",
  "days": [
    {"day": "Monday", "focus": "Lower body",
     "exercises": [{"exercise": "squat", "sets": 3, "reps": 12}]}
  ],
  "tip": "one practical tip for the week"
}

Exercise ids you may use: squat, pushup, curl, press, lunge.
Follow the user's chosen days, exercises, level and session length EXACTLY.
Spread muscle groups so the same area isn't worked hard on back-to-back days.
If their recent form scores are low, use the lower end of the rep range."""


def summarize_history(workouts: Sequence[_Workout]) -> str:
    """
    A short text summary of recent training, e.g.
      "squats: 3 workouts, 90 reps, avg form 82/100"
    """
    if not workouts:
        return "No workouts yet (beginner)."

    sessions: dict[str, int] = defaultdict(int)
    reps: dict[str, int] = defaultdict(int)
    scores: dict[str, list[int]] = defaultdict(list)

    for workout in workouts:
        sessions[workout.exercise] += 1
        reps[workout.exercise] += workout.total_reps
        scores[workout.exercise].extend(s.form_score for s in workout.sets)

    lines = []
    for exercise in sorted(sessions):
        avg = round(sum(scores[exercise]) / len(scores[exercise])) if scores[exercise] else 0
        name = EXERCISE_NAMES.get(exercise, exercise)
        lines.append(f"{name}: {sessions[exercise]} workouts, {reps[exercise]} reps, avg form {avg}/100")
    return "\n".join(lines)


def describe_options(options: PlanOptions) -> str:
    return (
        f"Training days (use exactly these, in this order): {', '.join(options.weekdays)}\n"
        f"Allowed exercise ids (use only these): {', '.join(options.exercises)}\n"
        f"Level: {options.level} → {LEVEL_RULES[options.level]}\n"
        f"Session length: about {options.minutes} minutes → "
        f"{EXERCISES_PER_SESSION[options.minutes]} exercises per day"
    )


def build_plan_message(user: "User", recent_workouts: Sequence[_Workout], options: PlanOptions) -> str:
    return (
        f"User: {describe_user(user)}\n"
        f"Training in the last 14 days:\n{summarize_history(recent_workouts)}\n\n"
        f"Their choices:\n{describe_options(options)}\n\n"
        "Create their plan for this week."
    )


def plan_mistakes(plan: PlanContent, options: PlanOptions) -> list[str]:
    """
    Checks the AI followed the user's choices. Returns a list of problems
    (empty list = the plan is fine).
    """
    mistakes = []

    plan_days = [day.day for day in plan.days]
    if sorted(plan_days) != sorted(options.weekdays):
        mistakes.append(f"days were {plan_days}, expected {options.weekdays}")

    allowed = set(options.exercises)
    for day in plan.days:
        for item in day.exercises:
            if item.exercise not in allowed:
                mistakes.append(f"{day.day} uses {item.exercise}, which wasn't chosen")

    return mistakes
