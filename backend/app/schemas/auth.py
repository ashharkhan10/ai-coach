"""
Data shapes for sign up and log in.
FastAPI checks incoming data against these automatically.
"""

from pydantic import BaseModel, EmailStr, Field

from app.schemas.user import UserOut


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)
    name: str = Field(min_length=1, max_length=100)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    """Sent back after sign up or log in."""

    token: str
    user: UserOut
