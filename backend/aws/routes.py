from fastapi import APIRouter
from aws.cost_service import get_aws_cost

router = APIRouter()

@router.get("/cost")
def fetch_cost():
    cost = get_aws_cost()
    return {"cost": cost}