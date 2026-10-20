"""
The live voice coach: writes one short spoken line for each workout moment.
"""

from typing import TYPE_CHECKING

from app.schemas.coach import CoachRequest
from app.services.profile_text import describe_user

if TYPE_CHECKING:  # only for type hints, so tests don't need a database
    from app.models import User

EXERCISE_NAMES = {
    "squat": "squats",
    "pushup": "push-ups",
    "curl": "biceps curls",
    "press": "shoulder press",
    "lunge": "lunges",
}

SYSTEM_PROMPT = """You are AI Coach, an upbeat, expert personal trainer speaking OUT LOUD to a user during a live workout.

Rules:
- Reply with ONE spoken sentence of 6 to 16 words.
- Talk to the user directly ("Keep your chest up"), never about them.
- No emojis, no quotes, no hashtags, no greetings, no questions.
- Be specific to the exercise and the situation. Safety first.
- Use the user's name at most occasionally."""


def build_coach_message(user: "User", request: CoachRequest) -> str:
    """What we tell the AI about the current moment."""
    exercise = EXERCISE_NAMES[request.exercise]
    lines = [f"User: {describe_user(user)}", f"Exercise: {exercise}."]

    if request.event == "workout_started":
        lines.append(f"Moment: the workout just started ({request.total_sets} sets). Give a sharp, motivating start cue.")

    elif request.event == "form_issue":
        lines.append(f"Moment: mid-set, their form slipped. Problem: {request.issue} Give a calm, precise correction.")

    elif request.event == "set_completed":
        lines.append(
            f"Moment: they just finished set {request.set_number} of {request.total_sets} "
            f"with a form score of {request.form_score}/100."
        )
        if request.issue:
            lines.append(f"Their most common mistake that set: {request.issue}")
        lines.append("Praise them and give one tip for the next set.")

    elif request.event == "workout_completed":
        lines.append(
            f"Moment: workout finished. {request.reps} reps in total, average form {request.form_score}/100. "
            "Give a warm closing line that fits their goal."
        )

    return "\n".join(lines)


def fallback_line(request: CoachRequest) -> str:
    """A simple built-in line, used when the AI isn't available."""
    if request.event == "workout_started":
        return "Let's go! Focus on smooth, controlled reps."
    if request.event == "form_issue" and request.issue:
        return request.issue
    if request.event == "set_completed":
        return f"Set {request.set_number} done. Great work, breathe and get ready."
    return "Workout complete. Great job today!"
