"""
Workouts, stats and badges for the logged-in user.

POST /workouts       → save a finished workout (and unlock any new badges)
GET  /workouts       → recent workouts, newest first
GET  /stats          → weekly totals, streak and chart data
GET  /badges         → every badge, with earned_at if unlocked
"""

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models import SessionSet, User, UserBadge, WorkoutSession
from app.schemas.badge import BadgeOut
from app.schemas.stats import StatsOut
from app.schemas.workout import WorkoutIn, WorkoutOut, WorkoutSavedResponse
from app.security.current_user import get_current_user
from app.services.badges import BADGES, BADGES_BY_ID, build_progress, earned_badge_ids
from app.services.stats import build_stats, local_day

router = APIRouter(tags=["workouts"])


@router.post("/workouts", response_model=WorkoutSavedResponse, status_code=201)
def save_workout(
    data: WorkoutIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workout = WorkoutSession(
        user_id=user.id,
        exercise=data.exercise,
        target_sets=data.target_sets,
        target_reps=data.target_reps,
        started_at=data.started_at,
        ended_at=data.ended_at,
        total_reps=sum(s.reps for s in data.sets),
        duration_sec=round((data.ended_at - data.started_at).total_seconds()),
        sets=[SessionSet(**s.model_dump()) for s in data.sets],
    )
    db.add(workout)
    db.flush()  # gives the workout an id before badges are checked

    new_badges = _unlock_new_badges(db, user, data.tz_offset_minutes)

    db.commit()
    db.refresh(workout)

    return WorkoutSavedResponse(workout=WorkoutOut.model_validate(workout), new_badges=new_badges)


@router.get("/workouts", response_model=list[WorkoutOut])
def list_workouts(
    limit: int = Query(default=20, ge=1, le=100),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        select(WorkoutSession)
        .where(WorkoutSession.user_id == user.id)
        .options(selectinload(WorkoutSession.sets))
        .order_by(WorkoutSession.started_at.desc())
        .limit(limit)
    )
    return db.scalars(query).all()


@router.get("/stats", response_model=StatsOut)
def get_stats(
    tz_offset_minutes: int = Query(default=0, ge=-840, le=840),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workouts = _all_workouts(db, user)
    today = local_day(datetime.now(UTC), tz_offset_minutes)
    return build_stats(workouts, today, tz_offset_minutes)


@router.get("/badges", response_model=list[BadgeOut])
def list_badges(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    earned = {b.badge_id: b.earned_at for b in _earned_badges(db, user)}
    return [
        BadgeOut(id=b.id, name=b.name, description=b.description, earned_at=earned.get(b.id))
        for b in BADGES
    ]


# ---------- helpers ----------


def _all_workouts(db: Session, user: User) -> list[WorkoutSession]:
    query = (
        select(WorkoutSession)
        .where(WorkoutSession.user_id == user.id)
        .options(selectinload(WorkoutSession.sets))
    )
    return list(db.scalars(query).all())


def _earned_badges(db: Session, user: User) -> list[UserBadge]:
    return list(db.scalars(select(UserBadge).where(UserBadge.user_id == user.id)).all())


def _unlock_new_badges(db: Session, user: User, tz_offset_minutes: int) -> list[BadgeOut]:
    """Checks every badge and saves the ones the user just earned."""
    today = local_day(datetime.now(UTC), tz_offset_minutes)
    progress = build_progress(_all_workouts(db, user), today, tz_offset_minutes)

    already_have = {b.badge_id for b in _earned_badges(db, user)}
    newly_earned = earned_badge_ids(progress) - already_have

    now = datetime.now(UTC)
    unlocked = []
    for badge_id in sorted(newly_earned):
        db.add(UserBadge(user_id=user.id, badge_id=badge_id, earned_at=now))
        badge = BADGES_BY_ID[badge_id]
        unlocked.append(BadgeOut(id=badge.id, name=badge.name, description=badge.description, earned_at=now))
    return unlocked
