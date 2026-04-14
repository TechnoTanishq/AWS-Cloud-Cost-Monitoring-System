from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models.db_models as db_models

import secrets
from datetime import datetime, timedelta, timezone

from auth.utils import send_email, hash_password
import os
from dotenv import load_dotenv
load_dotenv()

FRONTEND_URL=os.getenv("FRONTEND_URL")
router = APIRouter()

reset_store = {}

@router.post("/forgot-password")
def forgot_password(data: dict, db: Session = Depends(get_db)):
    user = db.query(db_models.Client).filter_by(email=data["email"]).first()

    if not user:
        return {"message": "If account exists, email sent"}

    token = secrets.token_urlsafe(32)
    expiry = datetime.now(timezone.utc) + timedelta(minutes=15)

    reset_store[token] = {"email": user.email, "expiry": expiry}

    link = f"{FRONTEND_URL}/reset-password?token={token}"
    send_email(user.email, link)

    return {"message": "Reset link sent"}


@router.post("/reset-password")
def reset_password(data: dict, db: Session = Depends(get_db)):
    record = reset_store.get(data["token"])

    if not record:
        raise HTTPException(status_code=400, detail="Invalid token")

    if datetime.now(timezone.utc) > record["expiry"]:
        raise HTTPException(status_code=400, detail="Token expired")

    user = db.query(db_models.Client).filter_by(email=record["email"]).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(data["new_password"])
    db.commit()

    reset_store.pop(data["token"])

    return {"message": "Password reset successful"}