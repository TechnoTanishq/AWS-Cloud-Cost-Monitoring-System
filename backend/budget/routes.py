from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models.db_models as db_models
from auth.dependencies import get_current_user
from budget.schemas import BudgetCreate

router = APIRouter()


@router.post("/add")
def add_budget(
    data: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Upsert — update if exists for this user+month, else insert
    existing = db.query(db_models.Budget).filter_by(
        user_id=current_user["id"],
        month=data.month
    ).first()

    if existing:
        existing.amount = data.amount
    else:
        db.add(db_models.Budget(
            user_id=current_user["id"],
            amount=data.amount,
            month=data.month
        ))

    db.commit()
    return {"message": "Budget saved"}


@router.get("/")
def get_budgets(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return db.query(db_models.Budget).filter_by(
        user_id=current_user["id"]
    ).all()


@router.get("/current")
def get_current_budget(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Returns the budget for the current month."""
    from datetime import datetime
    month = datetime.today().strftime("%Y-%m")
    budget = db.query(db_models.Budget).filter_by(
        user_id=current_user["id"],
        month=month
    ).first()
    if not budget:
        return {"amount": None, "month": month}
    return {"amount": budget.amount, "month": budget.month}


@router.get("/check")
def check_budget(
    month: str,
    cost: float,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    budget = db.query(db_models.Budget).filter_by(
        user_id=current_user["id"],
        month=month
    ).first()

    if not budget:
        raise HTTPException(status_code=404, detail="No budget set")

    return {
        "budget": budget.amount,
        "cost": cost,
        "utilization": round((cost / budget.amount) * 100, 1),
        "exceeded": cost > budget.amount
    }
