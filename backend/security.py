"""
DEPRECATED: Use auth/utils.py instead.
Kept for backward compatibility only.
"""

from auth.utils import (
    hash_password,
    verify_password,
    create_access_token,
    create_password_reset_token,
    verify_password_reset_token,
)

__all__ = [
    "hash_password",
    "verify_password",
    "create_access_token",
    "create_password_reset_token",
    "verify_password_reset_token",
]
