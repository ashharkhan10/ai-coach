"""
Login tokens (JWT).

After logging in, the user gets a token. The browser sends it with every
request, so the backend knows who is asking. The token is signed with
JWT_SECRET, so nobody can fake one.
"""

from datetime import UTC, datetime, timedelta

import jwt

from app.config import JWT_SECRET, TOKEN_EXPIRE_DAYS

_ALGORITHM = "HS256"


def create_token(user_id: int) -> str:
    expires = datetime.now(UTC) + timedelta(days=TOKEN_EXPIRE_DAYS)
    payload = {"sub": str(user_id), "exp": expires}
    return jwt.encode(payload, JWT_SECRET, algorithm=_ALGORITHM)


def read_user_id(token: str) -> int | None:
    """Returns the user id inside the token, or None if the token is bad or expired."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[_ALGORITHM])
        return int(payload["sub"])
    except (jwt.InvalidTokenError, KeyError, ValueError):
        return None
