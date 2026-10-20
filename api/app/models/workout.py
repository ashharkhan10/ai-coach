"""
Workout tables.

- workout_sessions: one row per workout (e.g. "3 × 10 squats on Monday")
- session_sets:     one row per set inside that workout
"""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)

    exercise: Mapped[str] = mapped_column(String(20))  # squat | pushup | curl | press | lunge
    target_sets: Mapped[int]
    target_reps: Mapped[int]

    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    ended_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    total_reps: Mapped[int]
    duration_sec: Mapped[int]

    sets: Mapped[list["SessionSet"]] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="SessionSet.set_number",
    )


class SessionSet(Base):
    __tablename__ = "session_sets"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[int] = mapped_column(
        ForeignKey("workout_sessions.id", ondelete="CASCADE"), index=True
    )

    set_number: Mapped[int]
    reps: Mapped[int]
    duration_sec: Mapped[int]
    form_score: Mapped[int]  # 0–100
    main_issue: Mapped[str | None] = mapped_column(String(200))  # most common form problem

    session: Mapped[WorkoutSession] = relationship(back_populates="sets")
