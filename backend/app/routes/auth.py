"""
Sign up and log in.

POST /auth/signup  → create an account, returns a token
POST /auth/login   → check email + password, returns a token
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas.auth import AuthResponse, LoginRequest, SignupRequest
from app.schemas.user import UserOut
from app.security.passwords import hash_password, verify_password
from app.security.tokens import create_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    email = data.email.lower()

    if _find_by_email(db, email):
        raise HTTPException(status.HTTP_409_CONFLICT, detail="An account with this email already exists.")

    user = User(email=email, password_hash=hash_password(data.password), name=data.name.strip())
    db.add(user)
    db.commit()
    db.refresh(user)

    return AuthResponse(token=create_token(user.id), user=UserOut.model_validate(user))


@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = _find_by_email(db, data.email.lower())

    # Same message for both cases, so nobody can guess which emails exist.
    if user is None or not verify_password(data.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Wrong email or password.")

    return AuthResponse(token=create_token(user.id), user=UserOut.model_validate(user))


def _find_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email))
