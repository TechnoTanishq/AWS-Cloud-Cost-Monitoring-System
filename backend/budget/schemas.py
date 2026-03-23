from pydantic import BaseModel

class BudgetCreate(BaseModel):
    amount: float
    month: str