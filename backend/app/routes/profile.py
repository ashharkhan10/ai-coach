"""
The logged-in user's profile.

GET /me  → read my profile
PUT /me  → update my profile
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas.user import ProfileUpdate, UserOut
from app.security.current_user import get_current_user

router = APIRouter(prefix="/me", tags=["profile"])


@router.get("", response_model=UserOut)
def read_my_profile(user: User = Depends(get_current_user)):
    return user


@router.put("", response_model=UserOut)
def update_my_profile(
    data: ProfileUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user.name = data.name.strip()
    user.age = data.age
    user.height_cm = data.height_cm
    user.weight_kg = data.weight_kg
    user.goal = data.goal

    db.commit()
    db.refresh(user)
    return user
