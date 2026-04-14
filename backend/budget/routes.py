from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models.db_models as db_models

from auth.dependencies import get_current_user
from auth.utils import send_budget_alert
from budget.schemas import BudgetCreate

router = APIRouter()


# ✅ ADD / UPDATE BUDGET
@router.post("/add")
def add_budget(
    data: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    existing = db.query(db_models.Budget).filter_by(
        user_id=current_user["id"],
        month=data.month
    ).first()

    if existing:
        existing.amount = data.amount
    else:
        budget = db_models.Budget(
            user_id=current_user["id"],
            amount=data.amount,
            month=data.month
        )
        db.add(budget)

    db.commit()

    return {"message": "Budget saved"}


# ✅ GET BUDGETS
@router.get("/")
def get_budgets(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return db.query(db_models.Budget).filter_by(
        user_id=current_user["id"]
    ).all()


# ✅ CHECK + EMAIL ALERT (FIXED)
@router.get("/check")
def check_budget(
    month: str,
    cost: float,
    threshold:float=100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # 🔥 FIX: get latest budget
    budget = db.query(db_models.Budget).filter_by(
        user_id=current_user["id"],
        month=month
    ).order_by(db_models.Budget.id.desc()).first()

    if not budget:
        raise HTTPException(status_code=404, detail="No budget set")

    # 🔹 get user
    user = db.query(db_models.Client).filter_by(
        id=current_user["id"]
    ).first()

    # 🔹 email trigger
    limit=(threshold/100)*budget.amount
    if cost >= limit and user:
        print("EMAIL SHOULD TRIGGER")

        send_budget_alert(
            to_email=user.email,
            cost=cost,
            budget=budget.amount
        )

    return {
        "budget": budget.amount,
        "cost": cost,
        "exceeded": cost > budget.amount
    }