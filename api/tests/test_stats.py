"""
Tests for app/services/stats.py. Run with:  pytest
"""

from datetime import UTC, date, datetime
from types import SimpleNamespace

from app.services.stats import build_stats, local_day, streak_days

TODAY = date(2026, 10, 20)
INDIA = -330  # JavaScript's getTimezoneOffset() in India


def fake_workout(day: date, reps: int = 10, scores=(80,), seconds: int = 120):
    """A pretend workout at noon UTC on the given day."""
    return SimpleNamespace(
        started_at=datetime(day.year, day.month, day.day, 12, tzinfo=UTC),
        total_reps=reps,
        duration_sec=seconds,
        sets=[SimpleNamespace(form_score=s) for s in scores],
        exercise="squat",
    )


def test_local_day_uses_the_users_time_zone():
    # 20:00 UTC on the 19th is already 01:30 on the 20th in India.
    moment = datetime(2026, 10, 19, 20, 0, tzinfo=UTC)
    assert local_day(moment, INDIA) == date(2026, 10, 20)
    assert local_day(moment, 0) == date(2026, 10, 19)


def test_streak_counts_days_in_a_row():
    days = {date(2026, 10, 18), date(2026, 10, 19), date(2026, 10, 20)}
    assert streak_days(days, TODAY) == 3


def test_streak_still_counts_if_not_trained_yet_today():
    days = {date(2026, 10, 18), date(2026, 10, 19)}
    assert streak_days(days, TODAY) == 2


def test_streak_breaks_after_a_missed_day():
    days = {date(2026, 10, 16), date(2026, 10, 20)}
    assert streak_days(days, TODAY) == 1


def test_streak_is_zero_with_no_recent_training():
    assert streak_days({date(2026, 10, 1)}, TODAY) == 0


def test_weekly_totals_only_include_the_last_7_days():
    workouts = [
        fake_workout(date(2026, 10, 20), reps=10, scores=(90, 70), seconds=120),
        fake_workout(date(2026, 10, 14), reps=5, seconds=60),  # 6 days ago: counts
        fake_workout(date(2026, 10, 13), reps=99),  # 7 days ago: too old
    ]
    stats = build_stats(workouts, TODAY, 0)
    assert stats.week_reps == 15
    assert stats.week_sets == 3
    assert stats.week_minutes == 3


def test_daily_chart_has_14_days_with_averages():
    workouts = [fake_workout(TODAY, reps=12, scores=(90, 70))]
    stats = build_stats(workouts, TODAY, 0)

    assert len(stats.daily) == 14
    assert stats.daily[-1].day == TODAY
    assert stats.daily[-1].reps == 12
    assert stats.daily[-1].avg_form == 80
    assert stats.daily[0].avg_form is None  # no workout that day
