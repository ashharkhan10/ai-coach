"""
All settings for the backend live here.

Values are read from the .env file, so secrets never go inside the code.
"""

import os

from dotenv import load_dotenv

load_dotenv()


def _required(name: str) -> str:
    """Reads a setting that MUST exist, with a clear error if it's missing."""
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing {name} in api/.env — see .env.example")
    return value


# The address of the frontend. Only this site is allowed to call the backend.
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Database address from Supabase.
# SQLAlchemy needs "postgresql+psycopg://" to know which driver to use.
DATABASE_URL = _required("DATABASE_URL").replace("postgresql://", "postgresql+psycopg://", 1)

# Secret key used to sign login tokens (JWT).
JWT_SECRET = _required("JWT_SECRET")

# How long a login lasts before the user must log in again.
TOKEN_EXPIRE_DAYS = 7

# Groq AI (voice coach + workout plans). Optional: without it, the app
# still works and the coach falls back to simple built-in tips.
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
