"""
Authentication module - JWT-based, no sessions
"""

from .routes import router
from .dependencies import get_current_user
from .utils import (
    create_access_token,
    verify_access_token,
    hash_password,
    verify_password,
)

__all__ = [
    "router",
    "get_current_user",
    "create_access_token",
    "verify_access_token",
    "hash_password",
    "verify_password",
]
