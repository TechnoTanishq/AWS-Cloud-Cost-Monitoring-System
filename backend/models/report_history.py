from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class ReportHistory(Base):
    __tablename__ = "report_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("ClientData.id"), nullable=False)
    month = Column(String, nullable=False)   # e.g. "2026-04"
    year = Column(Integer, nullable=False)
    total_cost = Column(Float, nullable=True)
    predicted_cost = Column(Float, nullable=True)
    mom_change = Column(Float, nullable=True)
    top_service = Column(String, nullable=True)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
