from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth.dependencies import get_current_user
from models.report_history import ReportHistory
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class SaveReportRequest(BaseModel):
    month: str          # "2026-04"
    year: int
    total_cost: Optional[float] = None
    predicted_cost: Optional[float] = None
    mom_change: Optional[float] = None
    top_service: Optional[str] = None

@router.post("/save")
def save_report(
    data: SaveReportRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    record = ReportHistory(
        user_id=user["id"],
        month=data.month,
        year=data.year,
        total_cost=data.total_cost,
        predicted_cost=data.predicted_cost,
        mom_change=data.mom_change,
        top_service=data.top_service,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"id": record.id, "generated_at": record.generated_at}

@router.get("/history")
def get_report_history(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    records = (
        db.query(ReportHistory)
        .filter_by(user_id=user["id"])
        .order_by(ReportHistory.generated_at.desc())
        .limit(24)
        .all()
    )
    return [
        {
            "id": r.id,
            "month": r.month,
            "year": r.year,
            "total_cost": r.total_cost,
            "predicted_cost": r.predicted_cost,
            "mom_change": r.mom_change,
            "top_service": r.top_service,
            "generated_at": r.generated_at,
        }
        for r in records
    ]
