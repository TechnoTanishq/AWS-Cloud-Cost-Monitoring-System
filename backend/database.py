"""
Database Configuration and Session Management
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Database URL
DB_URL = "sqlite:///./finsight.db"

# Create engine
engine = create_engine(
    DB_URL,
    connect_args={"check_same_thread": False},  # Required for SQLite
    echo=False
)

# Create session factory
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

print("Database Connected")


# Dependency for getting DB session
def get_db():
    """Dependency for database session injection."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 