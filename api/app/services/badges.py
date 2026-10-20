"""
Badges: the list of badges, and which ones a user has earned.

To add a badge: add one line to BADGES with a check function.
"""

from collections.abc import Callable, Sequence
from dataclasses import dataclass, field
from datetime import date
from typing import Protocol

from app.services.stats import Workout, local_day, streak_days

ALL_EXERCISES = {"squat", "pushup", "curl", "press", "lunge"}


@dataclass
class Progress:
    """Everything the badge checks need to know about a user."""

    total_workouts: int = 0
    total_reps: int = 0
    best_set_score: int = 0
    streak: int = 0
    exercises_tried: set[str] = field(default_factory=set)


@dataclass(frozen=True)
class Badge:
    id: str
    name: str
    description: str
    is_earned: Callable[[Progress], bool]


BADGES: list[Badge] = [
    Badge("first_workout", "First step", "Finish your first workout", lambda p: p.total_workouts >= 1),
    Badge("reps_100", "Century", "Do 100 reps in total", lambda p: p.total_reps >= 100),
    Badge("reps_1000", "Rep machine", "Do 1,000 reps in total", lambda p: p.total_reps >= 1000),
    Badge("perfect_set", "Perfect form", "Score 95+ form in a set", lambda p: p.best_set_score >= 95),
    Badge("streak_3", "On fire", "Train 3 days in a row", lambda p: p.streak >= 3),
    Badge("streak_7", "Unstoppable", "Train 7 days in a row", lambda p: p.streak >= 7),
    Badge("all_rounder", "All-rounder", "Try all 5 exercises", lambda p: ALL_EXERCISES <= p.exercises_tried),
]

BADGES_BY_ID = {badge.id: badge for badge in BADGES}


class _WorkoutWithExercise(Workout, Protocol):
    exercise: str


def build_progress(workouts: Sequence[_WorkoutWithExercise], today: date, tz_offset_minutes: int) -> Progress:
    days = {local_day(w.started_at, tz_offset_minutes) for w in workouts}
    set_scores = [s.form_score for w in workouts for s in w.sets]

    return Progress(
        total_workouts=len(workouts),
        total_reps=sum(w.total_reps for w in workouts),
        best_set_score=max(set_scores, default=0),
        streak=streak_days(days, today),
        exercises_tried={w.exercise for w in workouts},
    )


def earned_badge_ids(progress: Progress) -> set[str]:
    return {badge.id for badge in BADGES if badge.is_earned(progress)}
