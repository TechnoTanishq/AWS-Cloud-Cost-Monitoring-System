# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# from database import engine
# import db_models

# from auth.routes import router as auth_router
# from auth.dependencies import get_current_user
# from aws.cost_explorer import router as cost_router
# from aws.iam import router as iam_router

# import os
# from dotenv import load_dotenv

# from auth.password_routes import router as password_router
# from auth.google_routes import router as google_router
# from sqlalchemy.orm import Session
# from fastapi import Depends, HTTPException, status
# from database import get_db

# from dotenv import load_dotenv
# load_dotenv()

# from budget.routes import router as budget_router


# app = FastAPI(
#     title="FinSight API",
#     version="1.0.0"
# )

# # ============================================================================
# # MIDDLEWARE
# # ============================================================================
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:8080",
#         "http://localhost:5173",
#         "http://localhost:5174",
#         "http://localhost:3000",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ============================================================================
# # ROUTE REGISTRATION
# # ============================================================================

# app.include_router(auth_router, prefix="/auth", tags=["authentication"])
# app.include_router(password_router, prefix="/auth", tags=["password"])
# app.include_router(google_router, prefix="/auth", tags=["google"])
# app.include_router(cost_router, prefix="/costs", tags=["costs"])
# app.include_router(iam_router, prefix="/iam", tags=["iam"])
# app.include_router(budget_router, prefix="/budget", tags=["budget"])
# from aws.routes import router as aws_router

# app.include_router(aws_router, prefix="/aws", tags=["aws"])

# db_models.Base.metadata.create_all(bind=engine)

# @app.get("/")
# def read_root():
#     return {"message": "Welcome to FinSight"}


# @app.get("/clients")
# def get_clients(db: Session = Depends(get_db)):
#     return db.query(db_models.Client).all()


# # ============================================================================
# # PROTECTED ROUTES
# # ============================================================================

# @app.get("/me")
# def get_current_user_info(current_user: dict = Depends(get_current_user)):
#     return current_user


# @app.put("/update/{user_id}")
# def update_user(
#     user_id: int,
#     data: dict,
#     db: Session = Depends(get_db),
#     current_user: dict = Depends(get_current_user),
# ):
#     if current_user.get("id") != user_id:
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
#                             detail="Cannot update another user's account")

#     db_user = db.query(db_models.Client).filter(db_models.Client.id == user_id).first()
#     if not db_user:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

#     if "name" in data:
#         db_user.name = data["name"]
#     if "organization" in data:
#         db_user.organization = data["organization"]

#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)

#     return {
#         "id": db_user.id,
#         "name": db_user.name,
#         "email": db_user.email,
#         "organization": db_user.organization,
#     }


# @app.delete("/delete/{user_id}")
# def delete_user(
#     user_id: int,
#     db: Session = Depends(get_db),
#     current_user: dict = Depends(get_current_user),
# ):
#     if current_user.get("id") != user_id:
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
#                             detail="Cannot delete another user's account")

#     db_user = db.query(db_models.Client).filter(db_models.Client.id == user_id).first()
#     if not db_user:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

#     db.delete(db_user)
#     db.commit()

#     return {"message": "User account deleted successfully"}


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
# def root():
#     return {"message": "FinSight Backend Running"}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
import models.db_models as db_models
import models.aws_account  # ensures aws_accounts table is registered with Base
import models.report_history  # ensures report_history table is registered with Base

from auth.routes import router as auth_router
from auth.dependencies import get_current_user
from aws.cost_explorer import router as cost_router
from aws.iam import router as iam_router

import os
from dotenv import load_dotenv

from auth.password_routes import router as password_router
from auth.google_routes import router as google_router
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from database import get_db

from dotenv import load_dotenv
load_dotenv()

import logging
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(name)s — %(message)s")

from budget.routes import router as budget_router
from reports.routes import router as reports_router


app = FastAPI(
    title="FinSight API",
    version="1.0.0"
)


origins = [
    "http://localhost:5173",  # your frontend URL
]

# ============================================================================
# MIDDLEWARE
# ============================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# ROUTE REGISTRATION
# ============================================================================

app.include_router(auth_router, prefix="/auth", tags=["authentication"])
app.include_router(password_router, prefix="/auth", tags=["password"])
app.include_router(google_router, prefix="/auth", tags=["google"])
app.include_router(cost_router, prefix="/costs", tags=["costs"])
app.include_router(iam_router, prefix="/iam", tags=["iam"])
app.include_router(budget_router, prefix="/budget", tags=["budget"])
app.include_router(reports_router, prefix="/reports", tags=["reports"])
from aws.routes import router as aws_router

app.include_router(aws_router, prefix="/aws", tags=["aws"])

db_models.Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Welcome to FinSight"}


@app.get("/clients")
def get_clients(db: Session = Depends(get_db)):
    return db.query(db_models.Client).all()


# ============================================================================
# PROTECTED ROUTES
# ============================================================================

@app.get("/me")
def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return current_user


@app.put("/update/{user_id}")
def update_user(
    user_id: int,
    data: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("id") != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Cannot update another user's account")

    db_user = db.query(db_models.Client).filter(db_models.Client.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

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
    if current_user.get("id") != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Cannot delete another user's account")

    db_user = db.query(db_models.Client).filter(db_models.Client.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db.delete(db_user)
    db.commit()

    return {"message": "User account deleted successfully"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
def root():
    return {"message": "FinSight Backend Running"}
