<<<<<<< HEAD
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from database import session, engine
import db_models
import models
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from security import hash_password, verify_password, create_access_token

import smtplib
from email.mime.text import MIMEText
import secrets
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# ----------------------------
# Load ENV
# ----------------------------
load_dotenv()

# ----------------------------
# FastAPI
# ----------------------------
app = FastAPI()

# ----------------------------
# CORS
# ----------------------------
=======
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
>>>>>>> 801bc75 (feat: implement OAuth2 and secure password recovery system)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
<<<<<<< HEAD
        "http://127.0.0.1:8080",
=======
        "http://localhost:5173",
        "http://localhost:3000",
>>>>>>> 801bc75 (feat: implement OAuth2 and secure password recovery system)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
# ----------------------------
# Create Tables
# ----------------------------
db_models.Base.metadata.create_all(bind=engine)

# ----------------------------
# In-memory reset token store
# ----------------------------
reset_store = {}

# ----------------------------
# Request Models
# ----------------------------
class EmailRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# ----------------------------
# Email Sender (HTML)
# ----------------------------
def send_email(to_email, reset_link):
    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_PASS")

    if not sender_email or not sender_password:
        raise Exception("Email credentials missing in .env")

    html_content = f"""
    <html>
    <body style="font-family: Arial; background:#f4f6f8; padding:20px;">
        <div style="max-width:500px; margin:auto; background:white; padding:25px; border-radius:8px;">
            
            <h2 style="color:#2563eb; text-align:center;">FinSight Password Reset</h2>

            <p>Hello,</p>
            <p>You requested to reset your password.</p>

            <div style="text-align:center; margin:30px 0;">
                <a href="{reset_link}" 
                   style="background:#2563eb; color:white; padding:12px 20px; 
                          text-decoration:none; border-radius:6px; font-weight:bold;">
                   Reset Password
                </a>
            </div>

            <p style="font-size:14px; color:#555;">
                This link expires in <b>15 minutes</b>.
            </p>

            <p style="font-size:13px; color:#888;">
                If you did not request this, ignore this email.
            </p>

            <hr>
            <p style="font-size:12px; text-align:center; color:#999;">
                © 2026 FinSight — AWS Cloud Cost Monitoring System
            </p>

        </div>
    </body>
    </html>
    """

    msg = MIMEText(html_content, "html")
    msg["Subject"] = "FinSight Password Reset"
    msg["From"] = sender_email
    msg["To"] = to_email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())

# ----------------------------
# DB Dependency
# ----------------------------
def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

# ----------------------------
# Routes
# ----------------------------
@app.get("/")
def read_root():
    return {"message": "Welcome to FinSight"}

@app.post("/register")
def register(clientData: models.Client, db: Session = Depends(get_db)):
    existing = db.query(db_models.Client).filter(
        db_models.Client.email == clientData.email
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = db_models.Client(
        name=clientData.name,
        email=clientData.email,
        password=hash_password(clientData.password),
        organization=clientData.organization
    )

    db.add(new_user)
    db.commit()

    return {"message": "User created successfully"}

@app.post("/login")
def login(clientData: models.ClientLogin, db: Session = Depends(get_db)):
    user = db.query(db_models.Client).filter(
        db_models.Client.email == clientData.email
    ).first()

    if not user or not verify_password(clientData.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id)})
=======
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
>>>>>>> 801bc75 (feat: implement OAuth2 and secure password recovery system)

@app.get("/me")
def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """
    Get current authenticated user's information.
    Requires: Authorization header with valid JWT token.
    """
    return {
<<<<<<< HEAD
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "organization": user.organization
        }
    }

# ----------------------------
# Forgot Password
# ----------------------------
@app.post("/forgot-password")
def forgot_password(req: EmailRequest, db: Session = Depends(get_db)):
    user = db.query(db_models.Client).filter(
        db_models.Client.email == req.email
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")

    token = secrets.token_urlsafe(32)
    expiry = datetime.utcnow() + timedelta(minutes=15)

    reset_store[token] = {
        "email": req.email,
        "expiry": expiry
    }

    reset_link = f"http://localhost:8080/reset-password?token={token}"

    send_email(req.email, reset_link)

    return {"message": "Password reset link sent"}

# ----------------------------
# Reset Password
# ----------------------------
@app.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    data = reset_store.get(req.token)

    if not data:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    if datetime.utcnow() > data["expiry"]:
        reset_store.pop(req.token, None)
        raise HTTPException(status_code=400, detail="Token expired")

    user = db.query(db_models.Client).filter(
        db_models.Client.email == data["email"]
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(req.new_password)
    db.commit()

    reset_store.pop(req.token, None)

    return {"message": "Password reset successful"}
=======
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
>>>>>>> 801bc75 (feat: implement OAuth2 and secure password recovery system)
