"""
DEPRECATED: Use auth/utils.py instead.
This file is kept for backward compatibility only.
All authentication logic has been moved to auth/utils.py
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

from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

        # Create a new function get_current_user(token: str = Depends(oauth2_scheme))
# It should:
# - Decode JWT token using jwt.decode
# - Extract email from payload under key "sub"
# - Raise HTTPException(status_code=401) if token invalid
# - Return the email string