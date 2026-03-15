"""
Authentication Dependencies
- JWT extraction from Authorization header
- Current user dependency
"""

from fastapi import Depends, HTTPException, status
from starlette.authentication import AuthCredentials, SimpleUser
from starlette.requests import Request
from jose import JWTError
from sqlalchemy.orm import Session

from database import get_db
import db_models
from auth.utils import verify_access_token


def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> dict:
    """
    Extract and verify JWT from Authorization header.
    Returns the current authenticated user's information.
    
    Authorization header format:
        Authorization: Bearer <token>
    
    Usage:
        @app.get("/protected")
        def protected_route(current_user: dict = Depends(get_current_user)):
            return current_user
    
    Raises:
        HTTPException 403: If token is missing, invalid, or expired
    """
    
    # Extract Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Missing Authorization header"
        )
    
    # Parse Bearer token
    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid Authorization header format. Use: Bearer <token>"
        )
    
    token = parts[1]
    
    try:
        # Verify token and extract payload
        payload = verify_access_token(token)
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Invalid or expired token: {str(e)}"
        )
    
    # Extract user ID from token
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token: missing user ID"
        )
    
    # Fetch user from database to ensure they still exist
    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid user ID in token"
        )
    
    db_user = db.query(db_models.Client).filter(db_models.Client.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User not found"
        )
    
    # Return user data as dictionary
    return {
        "id": db_user.id,
        "email": db_user.email,
        "name": db_user.name,
        "organization": db_user.organization,
    }
