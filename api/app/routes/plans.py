"""
AI weekly workout plans.

POST /plans/generate  → ask the AI for a new plan (with the user's options) and save it
GET  /plans/latest    → the most recent plan (or null)
"""

from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models import User, WorkoutPlan, WorkoutSession
from app.schemas.plan import PlanContent, PlanOptions, PlanOut
from app.security.current_user import get_current_user
from app.services.llm import AIUnavailable, ask_ai_json
from app.services.planner import SYSTEM_PROMPT, build_plan_message, plan_mistakes

router = APIRouter(prefix="/plans", tags=["plans"])

# If the AI ignores the user's choices, ask again this many times.
ATTEMPTS = 2


@router.post("/generate", response_model=PlanOut, status_code=201)
def generate_plan(
    options: PlanOptions,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    two_weeks_ago = datetime.now(UTC) - timedelta(days=14)
    recent = db.scalars(
        select(WorkoutSession)
        .where(WorkoutSession.user_id == user.id, WorkoutSession.started_at >= two_weeks_ago)
        .options(selectinload(WorkoutSession.sets))
    ).all()

    content = _ask_for_plan(build_plan_message(user, recent, options), options)

    # The options are saved inside the plan's JSON, so the form can be pre-filled next time.
    plan = WorkoutPlan(user_id=user.id, plan={**content.model_dump(), "options": options.model_dump()})
    db.add(plan)
    db.commit()
    db.refresh(plan)

    return PlanOut(id=plan.id, created_at=plan.created_at, plan=content, options=options)


@router.get("/latest", response_model=PlanOut | None)
def latest_plan(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = db.scalar(
        select(WorkoutPlan)
        .where(WorkoutPlan.user_id == user.id)
        .order_by(WorkoutPlan.created_at.desc())
        .limit(1)
    )
    if plan is None:
        return None

    saved_options = plan.plan.get("options")
    return PlanOut(
        id=plan.id,
        created_at=plan.created_at,
        plan=PlanContent.model_validate(plan.plan),
        options=PlanOptions.model_validate(saved_options) if saved_options else None,
    )


def _ask_for_plan(message: str, options: PlanOptions) -> PlanContent:
    """Asks the AI, checks the reply, and tries again if it's wrong."""
    for attempt in range(1, ATTEMPTS + 1):
        try:
            content = PlanContent.model_validate(ask_ai_json(SYSTEM_PROMPT, message))
        except (AIUnavailable, ValidationError) as error:
            print(f"Plan attempt {attempt} failed: {error}")
            continue

        mistakes = plan_mistakes(content, options)
        if not mistakes:
            return content
        print(f"Plan attempt {attempt} ignored the user's choices: {mistakes}")

    raise HTTPException(502, detail="The AI couldn't make a plan right now. Please try again.")
