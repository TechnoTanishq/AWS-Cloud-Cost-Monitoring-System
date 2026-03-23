from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
import db_models

from auth.routes import router as auth_router
from auth.password_routes import router as password_router
from auth.google_routes import router as google_router

from dotenv import load_dotenv
load_dotenv()

from budget.routes import router as budget_router


app = FastAPI(
    title="FinSight API",
    version="1.0.0"
)

app.include_router(budget_router, prefix="/budget", tags=["budget"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from aws.routes import router as aws_router

app.include_router(aws_router, prefix="/aws", tags=["aws"])

db_models.Base.metadata.create_all(bind=engine)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(password_router, prefix="/auth", tags=["password"])
app.include_router(google_router, prefix="/auth", tags=["google"])

@app.get("/")
def root():
    return {"message": "FinSight Backend Running"}