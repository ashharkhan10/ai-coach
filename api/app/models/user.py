"""
The "users" table: one row per account.
"""

from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    # Login details
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))  # never the real password

    # Profile
    name: Mapped[str] = mapped_column(String(100))
    age: Mapped[int | None]
    height_cm: Mapped[float | None]
    weight_kg: Mapped[float | None]
    goal: Mapped[str | None] = mapped_column(String(20))  # lose_weight | build_muscle | stay_fit

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
