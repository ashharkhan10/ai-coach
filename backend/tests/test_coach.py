"""
Tests for the voice coach and planner text building. Run with:  pytest
(These don't call the real AI.)
"""

from types import SimpleNamespace

import pytest
from pydantic import ValidationError

from app.schemas.coach import CoachRequest
from app.schemas.plan import PlanContent
from app.services.coach import build_coach_message, fallback_line
from app.services.planner import summarize_history
from app.services.profile_text import describe_user


def fake_user(**changes):
    profile = dict(name="Ashhar", age=22, height_cm=175.0, weight_kg=70.0, goal="build_muscle")
    profile.update(changes)
    return SimpleNamespace(**profile)


def test_describe_user_with_full_profile():
    assert describe_user(fake_user()) == "Ashhar, 22 years old, 175 cm, 70 kg, goal: build muscle."


def test_describe_user_with_only_a_name():
    user = fake_user(age=None, height_cm=None, weight_kg=None, goal=None)
    assert describe_user(user) == "Ashhar."


def test_form_issue_message_includes_the_problem():
    request = CoachRequest(event="form_issue", exercise="squat", issue="Keep your chest up.")
    message = build_coach_message(fake_user(), request)
    assert "squats" in message
    assert "Keep your chest up." in message


def test_fallback_line_repeats_the_form_issue():
    request = CoachRequest(event="form_issue", exercise="pushup", issue="Tighten your core.")
    assert fallback_line(request) == "Tighten your core."


def test_history_summary_for_a_beginner():
    assert "beginner" in summarize_history([])


def test_history_summary_counts_reps_and_form():
    workouts = [
        SimpleNamespace(exercise="squat", total_reps=20, sets=[SimpleNamespace(form_score=80)]),
        SimpleNamespace(exercise="squat", total_reps=10, sets=[SimpleNamespace(form_score=90)]),
    ]
    assert summarize_history(workouts) == "squats: 2 workouts, 30 reps, avg form 85/100"


def valid_plan():
    return {
        "title": "Strength week",
        "summary": "Builds muscle with steady volume.",
        "days": [
            {"day": "Monday", "focus": "Lower body", "exercises": [{"exercise": "squat", "sets": 3, "reps": 12}]},
            {"day": "Wednesday", "focus": "Upper body", "exercises": [{"exercise": "pushup", "sets": 3, "reps": 10}]},
        ],
        "tip": "Rest well between days.",
    }


def test_a_correct_plan_is_accepted():
    assert PlanContent.model_validate(valid_plan()).title == "Strength week"


def test_a_plan_with_an_unknown_exercise_is_rejected():
    plan = valid_plan()
    plan["days"][0]["exercises"][0]["exercise"] = "deadlift"
    with pytest.raises(ValidationError):
        PlanContent.model_validate(plan)


# ---------- plan options ----------

from app.schemas.plan import PlanOptions  # noqa: E402
from app.services.planner import describe_options, plan_mistakes  # noqa: E402


def test_options_put_days_in_week_order_and_remove_repeats():
    options = PlanOptions(weekdays=["Friday", "Monday", "Friday"], exercises=["squat", "squat"])
    assert options.weekdays == ["Monday", "Friday"]
    assert options.exercises == ["squat"]


def test_options_need_at_least_two_days():
    with pytest.raises(ValidationError):
        PlanOptions(weekdays=["Monday"], exercises=["squat"])


def test_options_text_mentions_level_and_length():
    options = PlanOptions(weekdays=["Monday", "Wednesday"], exercises=["squat"], level="advanced", minutes=30)
    text = describe_options(options)
    assert "advanced" in text
    assert "3-4 exercises" in text


def test_plan_that_follows_the_choices_has_no_mistakes():
    options = PlanOptions(weekdays=["Monday", "Wednesday"], exercises=["squat", "pushup"])
    plan = PlanContent.model_validate(valid_plan())
    assert plan_mistakes(plan, options) == []


def test_plan_with_wrong_days_or_exercises_is_caught():
    options = PlanOptions(weekdays=["Tuesday", "Thursday"], exercises=["squat"])
    plan = PlanContent.model_validate(valid_plan())
    mistakes = plan_mistakes(plan, options)
    assert any("days were" in m for m in mistakes)
    assert any("pushup" in m for m in mistakes)


# ---------- workout splits ----------


def plan_with_days(*days):
    """A plan where each day is a list of exercise ids, e.g. ["squat", "lunge"]."""
    weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return PlanContent.model_validate({
        "title": "Test",
        "summary": "Test plan.",
        "days": [
            {"day": weekdays[i], "focus": "Day", "exercises": [{"exercise": e, "sets": 3, "reps": 10} for e in day]}
            for i, day in enumerate(days)
        ],
        "tip": "Rest well.",
    })


ALL_FIVE = ["squat", "pushup", "curl", "press", "lunge"]


def test_split_defaults_to_auto():
    assert PlanOptions(weekdays=["Monday", "Tuesday"], exercises=["squat"]).split == "auto"


def test_split_is_described_to_the_ai():
    options = PlanOptions(weekdays=["Monday", "Tuesday", "Wednesday"], exercises=ALL_FIVE, split="push_pull_legs")
    assert "Push" in describe_options(options)


def test_push_pull_legs_plan_is_accepted():
    options = PlanOptions(weekdays=["Monday", "Tuesday", "Wednesday"], exercises=ALL_FIVE, split="push_pull_legs")
    plan = plan_with_days(["pushup", "press"], ["curl"], ["squat", "lunge"])
    assert plan_mistakes(plan, options) == []


def test_push_day_with_squats_breaks_push_pull_legs():
    options = PlanOptions(weekdays=["Monday", "Tuesday", "Wednesday"], exercises=ALL_FIVE, split="push_pull_legs")
    plan = plan_with_days(["pushup", "squat"], ["curl"], ["squat", "lunge"])
    assert any("push_pull_legs" in m for m in plan_mistakes(plan, options))


def test_full_body_day_is_fine_in_full_body_split():
    options = PlanOptions(weekdays=["Monday", "Tuesday"], exercises=ALL_FIVE, split="full_body")
    plan = plan_with_days(["squat", "pushup", "curl"], ["lunge", "press"])
    assert plan_mistakes(plan, options) == []
