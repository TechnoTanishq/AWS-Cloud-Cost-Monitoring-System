from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import db_models

from auth.dependencies import get_current_user
from budget.schemas import BudgetCreate

router = APIRouter()


@router.post("/add")
def add_budget(
    data: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    budget = db_models.Budget(
        user_id=current_user["id"],
        amount=data.amount,
        month=data.month
    )

    db.add(budget)
    db.commit()

    return {"message": "Budget added"}


@router.get("/")
def get_budgets(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    budgets = db.query(db_models.Budget).filter_by(
        user_id=current_user["id"]
    ).all()

    return budgets



from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import db_models

from auth.dependencies import get_current_user
from budget.schemas import BudgetCreate

router = APIRouter()


@router.post("/add")
def add_budget(
    data: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    budget = db_models.Budget(
        user_id=current_user["id"],
        amount=data.amount,
        month=data.month
    )

    db.add(budget)
    db.commit()

    return {"message": "Budget added"}


@router.get("/")
def get_budgets(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return db.query(db_models.Budget).filter_by(
        user_id=current_user["id"]
    ).all()


# ✅ ADD IT HERE
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
        "exceeded": cost > budget.amount
    }