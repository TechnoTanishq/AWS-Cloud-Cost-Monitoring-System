"""
FastAPI Backend - AWS Cost Monitoring System
JWT-based Authentication (No Sessions)
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db
import db_models
from auth.routes import router as auth_router
from auth.dependencies import get_current_user

import os
from dotenv import load_dotenv

load_dotenv()

# Initialize app
app = FastAPI(
    title="FinSight API",
    description="AWS Cloud Cost Monitoring System",
    version="1.0.0"
)

# ============================================================================
# MIDDLEWARE CONFIGURATION
# ============================================================================

# CORS middleware - must be first
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# DATABASE INITIALIZATION
# ============================================================================

# Create all tables
db_models.Base.metadata.create_all(bind=engine)

# ============================================================================
# ROUTE REGISTRATION
# ============================================================================

# Include authentication router (register, login, forgot-password, reset-password, google)
app.include_router(auth_router, prefix="/auth", tags=["authentication"])

# ============================================================================
# PUBLIC ROUTES
# ============================================================================

@app.get("/")
def read_root():
    """Health check endpoint."""
    return {"message": "Welcome to FinSight"}


@app.get("/clients")
def get_clients(db: Session = Depends(get_db)):
    """Fetch all clients (public for now)."""
    db_clients = db.query(db_models.Client).all()
    return db_clients


# ============================================================================
# PROTECTED ROUTES
# ============================================================================

@app.get("/me")
def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """
    Get current authenticated user's information.
    Requires: Authorization header with valid JWT token.
    """
    return {
        "id": current_user.get("id"),
        "email": current_user.get("email"),
        "name": current_user.get("name"),
        "organization": current_user.get("organization"),
    }


# ============================================================================
# CRUD OPERATIONS (EXAMPLE - Can be extended)
# ============================================================================

@app.put("/update/{user_id}")
def update_user(
    user_id: int,
    data: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Update user information (only own account)."""
    # Ensure user can only update their own account
    if current_user.get("id") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot update another user's account"
        )

    db_user = db.query(db_models.Client).filter(db_models.Client.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Update allowed fields
    if "name" in data:
        db_user.name = data["name"]
    if "organization" in data:
        db_user.organization = data["organization"]

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {
        "id": db_user.id,
        "name": db_user.name,
        "email": db_user.email,
        "organization": db_user.organization,
    }


@app.delete("/delete/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Delete user account (only own account)."""
    if current_user.get("id") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot delete another user's account"
        )

    db_user = db.query(db_models.Client).filter(db_models.Client.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    db.delete(db_user)
    db.commit()

    return {"message": "User account deleted successfully"}


# ============================================================================
# ERROR HANDLERS
# ============================================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)