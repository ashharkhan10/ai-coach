"""
Database tables. Import every model here so they're all created at startup.
"""

from app.models.user import User

__all__ = ["User"]
