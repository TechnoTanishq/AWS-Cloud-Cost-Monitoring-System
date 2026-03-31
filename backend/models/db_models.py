#models/db_models.py
from sqlalchemy import Column, Integer, String,ForeignKey,Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

from sqlalchemy import Column, Integer, String, Float, ForeignKey
from database import Base


# ================================
# CLIENT TABLE
# ================================
class Client(Base):
    __tablename__ = "ClientData"   # keep same as your project

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    organization = Column(String)


# ================================
# BUDGET TABLE
# ================================
class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    
    # ✅ FIXED FOREIGN KEY
    user_id = Column(Integer, ForeignKey("ClientData.id"))
    
    amount = Column(Float, nullable=False)
    month = Column(String, nullable=False)