"""
Tests for app/services/badges.py. Run with:  pytest
"""

from datetime import UTC, date, datetime, timedelta
from types import SimpleNamespace

from app.services.badges import Progress, build_progress, earned_badge_ids

TODAY = date(2026, 10, 20)


def fake_workout(day: date, exercise: str = "squat", reps: int = 10, scores=(80,)):
    return SimpleNamespace(
        started_at=datetime(day.year, day.month, day.day, 12, tzinfo=UTC),
        total_reps=reps,
        duration_sec=60,
        sets=[SimpleNamespace(form_score=s) for s in scores],
        exercise=exercise,
    )


def test_no_badges_before_any_workout():
    assert earned_badge_ids(Progress()) == set()


def test_first_workout_badge():
    progress = build_progress([fake_workout(TODAY)], TODAY, 0)
    assert "first_workout" in earned_badge_ids(progress)


def test_rep_badges():
    assert "reps_100" in earned_badge_ids(Progress(total_reps=100))
    assert "reps_1000" not in earned_badge_ids(Progress(total_reps=999))


def test_perfect_form_badge():
    progress = build_progress([fake_workout(TODAY, scores=(60, 96))], TODAY, 0)
    assert "perfect_set" in earned_badge_ids(progress)


def test_streak_badge_after_3_days_in_a_row():
    workouts = [fake_workout(TODAY - timedelta(days=i)) for i in range(3)]
    progress = build_progress(workouts, TODAY, 0)
    assert progress.streak == 3
    assert "streak_3" in earned_badge_ids(progress)
    assert "streak_7" not in earned_badge_ids(progress)


def test_all_rounder_needs_all_5_exercises():
    four = [fake_workout(TODAY, exercise=e) for e in ["squat", "pushup", "curl", "press"]]
    assert "all_rounder" not in earned_badge_ids(build_progress(four, TODAY, 0))

    five = [*four, fake_workout(TODAY, exercise="lunge")]
    assert "all_rounder" in earned_badge_ids(build_progress(five, TODAY, 0))
