from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from urllib.parse import urlencode
import os
import httpx

from database import get_db
import models.db_models as db_models
from auth.utils import create_access_token

from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")


# ===========================
# GOOGLE LOGIN REDIRECT
# ===========================

@router.get("/google/login")
def google_login():
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": f"{BACKEND_URL}/auth/google/callback",
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }

    url = "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)
    return RedirectResponse(url)


# ===========================
# GOOGLE CALLBACK
# ===========================

@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):

    # Step 1: Exchange code for token
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": f"{BACKEND_URL}/auth/google/callback",
                "grant_type": "authorization_code",
            },
        )

    if token_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Token exchange failed")

    token_data = token_resp.json()
    id_token_str = token_data.get("id_token")

    # Step 2: Verify token
    try:
        request_adapter = google_requests.Request()
        claims = google_id_token.verify_oauth2_token(
            id_token_str, request_adapter, GOOGLE_CLIENT_ID
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    email = claims.get("email")
    name = claims.get("name", email.split("@")[0])

    # Step 3: Check / create user
    user = db.query(db_models.Client).filter_by(email=email).first()

    if not user:
        user = db_models.Client(
            name=name,
            email=email,
            password="",
            organization=""
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Step 4: Create JWT
    token = create_access_token({"sub": str(user.id), "email": user.email})

    # Step 5: Redirect to frontend callback
    query = urlencode({
        "token": token,
        "email": user.email,
    })

    return RedirectResponse(f"{FRONTEND_URL}/auth/google/callback?{query}")
