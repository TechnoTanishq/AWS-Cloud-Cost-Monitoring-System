"""
AWS Cost Explorer Routes (SECURE VERSION)
Uses IAM Role ARN stored in DB instead of frontend.
"""

from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta
import os
import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from sqlalchemy.orm import Session

# 👉 YOU MUST IMPORT THESE (we’ll fix if needed)
from database import get_db
from models.aws_account import AWSAccount
from auth import get_current_user   # adjust if your file name is different

router = APIRouter()

EXTERNAL_ID = "finsight-ext-a3b7c9d2e4f6"


# ============================================================================
# 🔐 Helper: Get CE client using stored role ARN
# ============================================================================

def get_ce_client(role_arn: str):
    sts = boto3.client(
        "sts",
        region_name=os.getenv("AWS_REGION", "us-east-1"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    )

    resp = sts.assume_role(
        RoleArn=role_arn,
        RoleSessionName="FinSightCESession",
        ExternalId=EXTERNAL_ID,
        DurationSeconds=3600,
    )

    creds = resp["Credentials"]

    return boto3.client(
        "ce",
        region_name="us-east-1",
        aws_access_key_id=creds["AccessKeyId"],
        aws_secret_access_key=creds["SecretAccessKey"],
        aws_session_token=creds["SessionToken"],
    )


def get_user_ce_client(db: Session, user):
    aws_account = db.query(AWSAccount).filter_by(user_id=user["id"]).first()

    if not aws_account:
        raise HTTPException(status_code=400, detail="AWS account not connected")

    return get_ce_client(aws_account.role_arn)


def has_aws_credentials():
    return bool(os.getenv("AWS_ACCESS_KEY_ID") and os.getenv("AWS_SECRET_ACCESS_KEY"))


# ============================================================================
# 📊 MONTHLY COSTS
# ============================================================================

@router.get("/monthly")
def get_monthly_costs(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not has_aws_credentials():
        return _mock_monthly()

    try:
        ce = get_user_ce_client(db, user)

        end = datetime.today().replace(day=1)
        start = (end - timedelta(days=180)).replace(day=1)

        resp = ce.get_cost_and_usage(
            TimePeriod={
                "Start": start.strftime("%Y-%m-%d"),
                "End": end.strftime("%Y-%m-%d"),
            },
            Granularity="MONTHLY",
            Metrics=["UnblendedCost"],
        )

        results = []
        for item in resp["ResultsByTime"]:
            month_str = item["TimePeriod"]["Start"][:7]
            month_label = datetime.strptime(month_str, "%Y-%m").strftime("%b")
            cost = round(float(item["Total"]["UnblendedCost"]["Amount"]), 2)
            results.append({"month": month_label, "cost": cost, "predicted": None})

        return results

    except (NoCredentialsError, ClientError) as e:
        raise HTTPException(status_code=502, detail=f"AWS error: {str(e)}")


# ============================================================================
# 📦 SERVICE COSTS
# ============================================================================

@router.get("/by-service")
def get_service_costs(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not has_aws_credentials():
        return _mock_services()

    try:
        ce = get_user_ce_client(db, user)

        today = datetime.today()
        start = today.replace(day=1).strftime("%Y-%m-%d")
        end = today.strftime("%Y-%m-%d")

        resp = ce.get_cost_and_usage(
            TimePeriod={"Start": start, "End": end},
            Granularity="MONTHLY",
            Metrics=["UnblendedCost"],
            GroupBy=[{"Type": "DIMENSION", "Key": "SERVICE"}],
        )

        groups = resp["ResultsByTime"][0]["Groups"] if resp["ResultsByTime"] else []

        items = [
            {
                "service": g["Keys"][0],
                "cost": round(float(g["Metrics"]["UnblendedCost"]["Amount"]), 2),
            }
            for g in groups
            if float(g["Metrics"]["UnblendedCost"]["Amount"]) > 0
        ]

        items.sort(key=lambda x: x["cost"], reverse=True)

        total = sum(i["cost"] for i in items) or 1
        for item in items:
            item["percentage"] = round((item["cost"] / total) * 100, 1)

        return items

    except (NoCredentialsError, ClientError) as e:
        raise HTTPException(status_code=502, detail=f"AWS error: {str(e)}")


# ============================================================================
# 📅 DAILY COSTS
# ============================================================================

@router.get("/daily")
def get_daily_costs(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not has_aws_credentials():
        return _mock_daily()

    try:
        ce = get_user_ce_client(db, user)

        end = datetime.today()
        start = end - timedelta(days=30)

        resp = ce.get_cost_and_usage(
            TimePeriod={
                "Start": start.strftime("%Y-%m-%d"),
                "End": end.strftime("%Y-%m-%d"),
            },
            Granularity="DAILY",
            Metrics=["UnblendedCost"],
        )

        return [
            {
                "day": i + 1,
                "date": item["TimePeriod"]["Start"],
                "cost": round(float(item["Total"]["UnblendedCost"]["Amount"]), 2),
            }
            for i, item in enumerate(resp["ResultsByTime"])
        ]

    except (NoCredentialsError, ClientError) as e:
        raise HTTPException(status_code=502, detail=f"AWS error: {str(e)}")


# ============================================================================
# 📊 STATS
# ============================================================================

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not has_aws_credentials():
        return _mock_stats()

    try:
        ce = get_user_ce_client(db, user)

        today = datetime.today()
        month_start = today.replace(day=1).strftime("%Y-%m-%d")
        today_str = today.strftime("%Y-%m-%d")

        resp = ce.get_cost_and_usage(
            TimePeriod={"Start": month_start, "End": today_str},
            Granularity="MONTHLY",
            Metrics=["UnblendedCost"],
        )

        current = round(float(resp["ResultsByTime"][0]["Total"]["UnblendedCost"]["Amount"]), 2)

        # Calculate predicted month-end (simple linear projection)
        today = datetime.today()
        days_in_month = (today.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)
        days_passed = today.day
        predicted = current * (days_in_month.day / days_passed)

        # Mock other values for now
        monthOverMonthChange = 10.0  # Placeholder
        budgetUtilization = 65  # Placeholder
        activeProjects = 2  # Placeholder

        return {
            "currentMonthCost": current,
            "predictedMonthEnd": round(predicted, 2),
            "monthOverMonthChange": monthOverMonthChange,
            "budgetUtilization": budgetUtilization,
            "activeProjects": activeProjects,
        }

    except (NoCredentialsError, ClientError) as e:
        raise HTTPException(status_code=502, detail=f"AWS error: {str(e)}")


# ============================================================================
# MOCKS (unchanged)
# ============================================================================

def _mock_monthly():
    return [{"month": "Jan", "cost": 1000, "predicted": None}]

def _mock_services():
    return [{"service": "EC2", "cost": 500, "percentage": 50}]

def _mock_daily():
    return [{"day": 1, "cost": 100}]

def _mock_stats():
    return {
        "currentMonthCost": 1000,
        "predictedMonthEnd": 1200,
        "monthOverMonthChange": 15.5,
        "budgetUtilization": 75,
        "activeProjects": 3
    }