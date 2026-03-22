"""
Authentication Routes
- POST /register - Manual user registration
- POST /login - Manual user login
- POST /google - Google OAuth sign-in
- POST /forgot-password - Request password reset token
- POST /reset-password - Reset password using token
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from urllib.parse import urljoin, urlencode
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from datetime import timedelta
import httpx
import os
from dotenv import load_dotenv

from database import get_db
import db_models
from auth.utils import (
    hash_password,
    verify_password,
    create_access_token,
    create_password_reset_token,
    verify_password_reset_token,
    validate_password_strength   
)
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests

load_dotenv()

router = APIRouter()

# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    organization: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class GoogleTokenRequest(BaseModel):
    id_token: str


# ============================================================================
# CONFIGURATION
# ============================================================================

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:8080")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

print(f"[CONFIG] FRONTEND_URL loaded as: {FRONTEND_URL}")
print(f"[CONFIG] BACKEND_URL loaded as: {BACKEND_URL}")

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")


# ============================================================================
# EMAIL UTILITY
# ============================================================================

def send_reset_email(to_email: str, reset_link: str):
    if not EMAIL_USER or not EMAIL_PASS:
        print(f"[DEV] Email credentials missing. Reset link: {reset_link}")
        return

    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    html_content = f"""
    <html>
    <body style="font-family: Arial; background:#f4f6f8; padding:20px;">
        <div style="max-width:500px; margin:auto; background:white; padding:25px; border-radius:8px;">
            <h2 style="color:#2563eb; text-align:center;">FinSight Password Reset</h2>
            <p>Hello,</p>
            <p>We received a request to reset your FinSight password.</p>
            <div style="text-align:center; margin:30px 0;">
                <a href="{reset_link}"
                   style="background:#2563eb; color:white; padding:14px 28px;
                          text-decoration:none; border-radius:6px; font-weight:bold;">
                   Reset My Password
                </a>
            </div>
            <p style="font-size:14px; color:#555;">This link expires in <b>15 minutes</b>.</p>
            <p style="font-size:13px; color:#888;">If you did not request this, ignore this email.</p>
            <hr>
            <p style="font-size:12px; text-align:center; color:#999;">
                © 2026 FinSight — AWS Cloud Cost Monitoring System
            </p>
        </div>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "FinSight — Password Reset Request"
    msg["From"] = f"FinSight <{EMAIL_USER}>"
    msg["To"] = to_email
    msg.attach(MIMEText(html_content, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, to_email, msg.as_string())

    print(f"[EMAIL] Reset email sent to {to_email}")

# ============================================================================
# 1. MANUAL REGISTRATION
# ============================================================================

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user with email and password.
    
    Request body:
    {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "SecurePassword123",
        "organization": "Acme Corp"
    }
    
    Responses:
    - 201: User created successfully
    - 400: Email already registered
    """
    
    # Check if email already exists
    existing_user = db.query(db_models.Client).filter(
        db_models.Client.email == payload.email
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already registered. Please login."
        )
    
    validate_password_strength(payload.password)  
      
    # Hash password
    hashed_password = hash_password(payload.password)
    
    # Create new user
    new_user = db_models.Client(
        name=payload.name,
        email=payload.email,
        password=hashed_password,
        organization=payload.organization,
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "message": "User created successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "organization": new_user.organization,
        }
    }


# ============================================================================
# 2. MANUAL LOGIN
# ============================================================================

@router.post("/login", status_code=status.HTTP_200_OK)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Login with email and password.
    
    Request body:
    {
        "email": "john@example.com",
        "password": "SecurePassword123"
    }
    
    Response:
    {
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "token_type": "bearer",
        "user": { ... }
    }
    
    Errors:
    - 401: Invalid email or password
    """
    
    # Find user by email
    db_user = db.query(db_models.Client).filter(
        db_models.Client.email == payload.email
    ).first()
    
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You're not registered yet. Please create an account."
        )
    
    # Verify password
    if not verify_password(payload.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )
    
    # Generate JWT token
    access_token = create_access_token(
        data={"sub": str(db_user.id), "email": db_user.email}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "organization": db_user.organization,
        }
    }


"""
3. GOOGLE OAUTH SIGN-IN
   The application supports two modes:
     a) Redirect flow (used by the frontend) - GET /auth/google/login
        followed by GET /auth/google/callback
     b) Token exchange flow - POST /auth/google (accepts id_token)

   Both produce a JWT for the user (auto-registering if necessary).
"""

# --- redirect flow ---------------------------------------------------------

@router.get("/google/login")
def google_login():
    """Redirect the user to Google's OAuth consent screen."""
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Google credentials not configured")

    # build url
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": f"{BACKEND_URL}/auth/google/callback",
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    url = "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)
    return RedirectResponse(url=url)


@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    """Handle Google's callback, exchange code for tokens, create JWT.

    This mirrors the previous stand-alone module but is now integrated.
    After generating the backend JWT we redirect to the FRONTEND_URL with
    query parameters `token`, `user`, and `verified=true`.  The frontend
    reads these and logs the user in.
    """

    if not code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Missing authorization code")

    # exchange code for tokens
    async with httpx.AsyncClient() as client:
        token_payload = {
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": f"{BACKEND_URL}/auth/google/callback",
            "grant_type": "authorization_code",
        }
        token_resp = await client.post("https://oauth2.googleapis.com/token",
                                       data=token_payload)
    if token_resp.status_code != 200:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Token exchange failed")
    token_data = token_resp.json()
    id_token_str = token_data.get("id_token")
    if not id_token_str:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="No ID token returned by Google")

    # verify id token
    try:
        request_adapter = google_requests.Request()
        claims = google_id_token.verify_oauth2_token(
            id_token_str, request_adapter, GOOGLE_CLIENT_ID)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail=f"Invalid ID token: {e}")

    email = claims.get("email")
    email_verified = claims.get("email_verified", False)
    name = claims.get("name", email.split("@")[0] if email else "")
    if not email or not email_verified:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Email not verified by Google")

    # check/create user
    db_user = db.query(db_models.Client).filter(db_models.Client.email == email).first()
    if not db_user:
        redirect_url = f"{FRONTEND_URL}/register?google=true&error=registration_required"        
        return RedirectResponse(url=redirect_url, status_code=303)

    access_token = create_access_token(data={"sub": str(db_user.id), "email": email})
    # Build a properly encoded redirect URL so special characters in the JWT
    # or email do not break the query string parsing in the browser.
    query = urlencode({"token": access_token, "user": email, "verified": "true"})
    redirect_url = f"{FRONTEND_URL}/auth/google/callback?{query}"
    print(f"[auth] Redirecting to frontend callback: {redirect_url[:80]}...")
    return RedirectResponse(url=redirect_url, status_code=303)


    # end of redirect flow


# --- token exchange flow (unchanged) --------------------------------------
    """
    Sign in with Google using ID token (from frontend).
    
    Request body:
    {
        "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ..."
    }
    
    Flow:
    1. Verify Google ID token signature using GOOGLE_CLIENT_ID
    2. Extract email and name from token claims
    3. Check if user exists in database
    4. If exists → generate JWT and return
    5. If NOT exists → auto-register user and return JWT
    
    Response:
    {
        "access_token": "...",
        "token_type": "bearer",
        "user": { ... }
    }
    
    Errors:
    - 401: Invalid or unverified token
    """
    
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google credentials not configured"
        )
    
    try:
        # Verify Google ID token
        request_adapter = google_requests.Request()
        claims = google_id_token.verify_oauth2_token(
            payload.id_token,
            request_adapter,
            GOOGLE_CLIENT_ID
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid ID token: {str(e)}"
        )
    
    # Extract user information from claims
    email = claims.get("email")
    email_verified = claims.get("email_verified", False)
    name = claims.get("name", email.split("@")[0] if email else "")
    
    if not email or not email_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email not verified by Google"
        )
    
    # Check if user exists
    db_user = db.query(db_models.Client).filter(
        db_models.Client.email == email
    ).first()
    
    # If user doesn't exist, auto-register
    if not db_user:
        db_user = db_models.Client(
            name=name,
            email=email,
            password="",  # Google OAuth - no password
            organization="",
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    
    # Generate JWT token
    access_token = create_access_token(
        data={"sub": str(db_user.id), "email": db_user.email}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "organization": db_user.organization,
        }
    }


# ============================================================================
# 4. FORGOT PASSWORD
# ============================================================================

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Request a password reset token.
    
    Request body:
    {
        "email": "john@example.com"
    }
    
    Response:
    {
        "message": "If an account exists...",
        "reset_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."  (only in dev)
    }
    
    Note:
    - Always returns success (don't leak email existence)
    - In production, send email with reset link
    - For now, returns reset_token in response for testing
    """
    
    db_user = db.query(db_models.Client).filter(
        db_models.Client.email == payload.email
    ).first()
    
    # Always return same response to avoid email enumeration
    if not db_user:
        return {
            "message": "If an account with that email exists, a password reset link was sent."
        }
    
    # Generate reset token (15-minute expiry)
    reset_token = create_password_reset_token(
        data={"sub": str(db_user.id)},
        expires_minutes=15
    )
    
    # Build reset link
    reset_link = f"{FRONTEND_URL}/reset-password?token={reset_token}"

    send_reset_email(db_user.email, reset_link)

    return {"message": "If an account with that email exists, a password reset link was sent."}

    # TODO: In production, send email with reset link containing the token
    # For now, return token for testing
    print(f"[DEV] Password reset token for {db_user.email}: {reset_token}")
    
    return {
        "message": "If an account with that email exists, a password reset link was sent.",
        "reset_token": reset_token,  # Only return in dev mode
    }


# ============================================================================
# 5. RESET PASSWORD
# ============================================================================

@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Reset user password using reset token.
    
    Request body:
    {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "new_password": "NewSecurePassword123"
    }
    
    Response:
    {
        "message": "Password has been reset successfully"
    }
    
    Errors:
    - 400: Invalid or expired token
    - 404: User not found
    """
    
    try:
        # Verify reset token
        token_data = verify_password_reset_token(payload.token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Extract user ID
    user_id = token_data.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token payload"
        )
    
    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    # Find user
    db_user = db.query(db_models.Client).filter(
        db_models.Client.id == user_id
    ).first()
    
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    import re

    def is_strong_password(password: str):
        return (
            len(password) >= 8 and
            re.search(r"[A-Z]", password) and
            re.search(r"[a-z]", password) and
            re.search(r"[0-9]", password) and
            re.search(r"[!@#$%^&*(),.?\":{}|<>]", password)
        )
    
    if not is_strong_password(payload.new_password):
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
        )
    
    password = payload.new_password

    errors = []

    if len(password) < 8:
        errors.append("at least 8 characters")

    if not any(c.isupper() for c in password):
        errors.append("1 uppercase letter")

    if not any(c.islower() for c in password):
        errors.append("1 lowercase letter")

    if not any(c.isdigit() for c in password):
        errors.append("1 number")

    if not any(c in "!@#$%^&*()_+-=" for c in password):
        errors.append("1 special character")

    if errors:
        raise HTTPException(
            status_code=400,
            detail="Password must contain: " + ", ".join(errors)
        )
    # Hash and update password
    db_user.password = hash_password(payload.new_password)
    db.add(db_user)
    db.commit()
    
    return {"message": "Password has been reset successfully"}
