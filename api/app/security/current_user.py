"""
get_current_user — finds out who is logged in.

Add it to any route that needs a logged-in user:

    def my_route(user: User = Depends(get_current_user)):
        ...

If the token is missing or wrong, the request is refused with 401.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.security.tokens import read_user_id

# Reads the "Authorization: Bearer <token>" header.
_bearer = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: Session = Depends(get_db),
) -> User:
    not_logged_in = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Please log in again.",
    )

    if credentials is None:
        raise not_logged_in

    user_id = read_user_id(credentials.credentials)
    if user_id is None:
        raise not_logged_in

    user = db.get(User, user_id)
    if user is None:
        raise not_logged_in

    return user
