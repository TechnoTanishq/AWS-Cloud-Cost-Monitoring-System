"""
Authentication Utilities
- Password hashing and verification
- JWT token creation and verification
- Password reset tokens
- Email sending (NEW)
"""

from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
import re
from fastapi import HTTPException

# NEW (for email)
import smtplib
from email.mime.text import MIMEText

load_dotenv()

# ============================================================================
# CONFIGURATION
# ============================================================================

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-key-change-this")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
RESET_TOKEN_EXPIRE_MINUTES = 15

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ============================================================================
# PASSWORD HASHING
# ============================================================================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# ============================================================================
# ACCESS TOKEN (JWT)
# ============================================================================

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as e:
        raise JWTError(f"Invalid token: {str(e)}")

# ============================================================================
# PASSWORD RESET TOKEN
# ============================================================================

def create_password_reset_token(data: dict, expires_minutes: int = RESET_TOKEN_EXPIRE_MINUTES) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)

    to_encode.update({
        "exp": expire,
        "scope": "password_reset"
    })

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_password_reset_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("scope") != "password_reset":
            raise JWTError("Invalid token scope")

        return payload

    except JWTError as e:
        raise JWTError(f"Invalid reset token: {str(e)}")

# ============================================================================
# PASSWORD VALIDATION
# ============================================================================

def validate_password_strength(password: str):
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")

    if not re.search(r"[A-Z]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter")

    if not re.search(r"[a-z]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one lowercase letter")

    if not re.search(r"[0-9]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one number")

    if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one special character")

# ============================================================================
# EMAIL SENDING (NEW - FINAL)
# ============================================================================

def send_email(to_email: str, reset_link: str):
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
                © 2026 FinSight
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

def send_budget_alert(to_email: str, cost: float, budget: float):
    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_PASS")

    body = f"""
    Hello,

    Your AWS cost has exceeded your budget.

    Budget: ${budget}
    Current Cost: ${cost}

    Please take action to control your expenses.

    - FinSight
    """

    msg = MIMEText(body, "plain")
    msg["Subject"] = "⚠️ Budget Exceeded Alert"
    msg["From"] = sender_email
    msg["To"] = to_email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())