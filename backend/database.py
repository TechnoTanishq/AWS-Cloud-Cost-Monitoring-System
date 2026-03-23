"""
Database Configuration and Session Management
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")

if not DB_URL:
    raise ValueError("DATABASE_URL not found in environment variables")

engine = create_engine(DB_URL)

session = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

# ✅ ADD THIS (VERY IMPORTANT)
Base = declarative_base()


def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

print("✅ Database Connected")