from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DB_URL = "sqlite:///./finsight.db"
engine = create_engine(DB_URL)
session = sessionmaker(bind=engine, autoflush=False, autocommit = False)
print("Database Connected") 