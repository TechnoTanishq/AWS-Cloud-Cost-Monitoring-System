from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import db_models

from auth.utils import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/register")
def register(data: dict, db: Session = Depends(get_db)):
    user = db.query(db_models.Client).filter_by(email=data["email"]).first()

    if user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = db_models.Client(
        name=data["name"],
        email=data["email"],
        password=hash_password(data["password"]),
        organization=data["organization"]
    )

    db.add(new_user)
    db.commit()

    return {"message": "Registered successfully"}


@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    user = db.query(db_models.Client).filter_by(email=data["email"]).first()

    if not user or not verify_password(data["password"], user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})

    return {
    "access_token": token,
    "user": {
        "email": user.email,
        "name": user.name
    }
}