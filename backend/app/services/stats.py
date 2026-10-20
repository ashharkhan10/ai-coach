"""
Workout statistics: weekly totals, streak, and daily progress for charts.

These functions only do maths on a list of workouts — no database —
so they are easy to test (see tests/test_stats.py).

A "workout" here is anything with: started_at, total_reps, duration_sec,
and sets (each with form_score).
"""

from datetime import date, datetime, timedelta
from typing import Protocol, Sequence

from app.schemas.stats import DayProgress, StatsOut


class _Set(Protocol):
    form_score: int


class Workout(Protocol):
    started_at: datetime
    total_reps: int
    duration_sec: int
    sets: Sequence[_Set]


def local_day(moment: datetime, tz_offset_minutes: int) -> date:
    """
    The calendar day in the user's own time zone.
    tz_offset_minutes comes from JavaScript: UTC minus local time (India = -330).
    """
    return (moment - timedelta(minutes=tz_offset_minutes)).date()


def streak_days(workout_days: set[date], today: date) -> int:
    """
    How many days in a row the user has trained, ending today.
    If they haven't trained YET today, a streak ending yesterday still counts.
    """
    day = today if today in workout_days else today - timedelta(days=1)
    streak = 0
    while day in workout_days:
        streak += 1
        day -= timedelta(days=1)
    return streak


def build_stats(workouts: Sequence[Workout], today: date, tz_offset_minutes: int, days: int = 14) -> StatsOut:
    week_start = today - timedelta(days=6)  # last 7 days including today
    chart_start = today - timedelta(days=days - 1)

    week_reps = week_sets = week_seconds = 0
    reps_by_day: dict[date, int] = {}
    scores_by_day: dict[date, list[int]] = {}

    for workout in workouts:
        day = local_day(workout.started_at, tz_offset_minutes)

        if day >= week_start:
            week_reps += workout.total_reps
            week_sets += len(workout.sets)
            week_seconds += workout.duration_sec

        if day >= chart_start:
            reps_by_day[day] = reps_by_day.get(day, 0) + workout.total_reps
            scores_by_day.setdefault(day, []).extend(s.form_score for s in workout.sets)

    all_days = {local_day(w.started_at, tz_offset_minutes) for w in workouts}

    daily = []
    for i in range(days):
        day = chart_start + timedelta(days=i)
        scores = scores_by_day.get(day)
        daily.append(
            DayProgress(
                day=day,
                reps=reps_by_day.get(day, 0),
                avg_form=round(sum(scores) / len(scores)) if scores else None,
            )
        )

    return StatsOut(
        week_reps=week_reps,
        week_sets=week_sets,
        week_minutes=round(week_seconds / 60),
        streak_days=streak_days(all_days, today),
        daily=daily,
    )
