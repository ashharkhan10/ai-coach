"""
Database connection.

- engine:       the connection to PostgreSQL (Supabase)
- Base:         every table class inherits from this
- get_db():     gives each request its own database session
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import DATABASE_URL

# pool_pre_ping checks the connection is alive before using it
# (useful because Supabase closes idle connections).
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    """Opens a database session for one request, and always closes it after."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
