"""
AWS Cost Explorer Routes
Fetches real cost data using boto3.
Falls back to mock data if AWS credentials are not configured.
"""

from fastapi import APIRouter, HTTPException, Query
from datetime import datetime, timedelta
import os
import boto3
from botocore.exceptions import NoCredentialsError, ClientError

router = APIRouter()

EXTERNAL_ID = "finsight-ext-a3b7c9d2e4f6"

def get_ce_client(role_arn: str = None):
    """Get Cost Explorer client — uses assumed role if role_arn provided, else static keys."""
    if role_arn:
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

    return boto3.client(
        "ce",
        region_name=os.getenv("AWS_REGION", "us-east-1"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    )

def has_aws_credentials():
    return bool(os.getenv("AWS_ACCESS_KEY_ID") and os.getenv("AWS_SECRET_ACCESS_KEY"))


# ============================================================================
# MONTHLY COSTS — last 6 months
# ============================================================================

@router.get("/monthly")
def get_monthly_costs(role_arn: str = Query(default=None)):
    if not has_aws_credentials():
        return _mock_monthly()
    try:
        ce = get_ce_client(role_arn)
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
            month_str = item["TimePeriod"]["Start"][:7]  # "2026-01"
            month_label = datetime.strptime(month_str, "%Y-%m").strftime("%b")
            cost = round(float(item["Total"]["UnblendedCost"]["Amount"]), 2)
            results.append({"month": month_label, "cost": cost, "predicted": None})

        return results

    except (NoCredentialsError, ClientError) as e:
        raise HTTPException(status_code=502, detail=f"AWS error: {str(e)}")


# ============================================================================
# SERVICE COSTS — current month breakdown
# ============================================================================

@router.get("/by-service")
def get_service_costs(role_arn: str = Query(default=None)):
    if not has_aws_credentials():
        return _mock_services()
    try:
        ce = get_ce_client(role_arn)
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
            {"service": g["Keys"][0], "cost": round(float(g["Metrics"]["UnblendedCost"]["Amount"]), 2)}
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
# DAILY COSTS — last 30 days
# ============================================================================

@router.get("/daily")
def get_daily_costs(role_arn: str = Query(default=None)):
    if not has_aws_credentials():
        return _mock_daily()
    try:
        ce = get_ce_client(role_arn)
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
# DASHBOARD STATS — summary
# ============================================================================

@router.get("/stats")
def get_dashboard_stats(role_arn: str = Query(default=None)):
    if not has_aws_credentials():
        return _mock_stats()

    try:
        ce = get_ce_client(role_arn)
        today = datetime.today()
        month_start = today.replace(day=1).strftime("%Y-%m-%d")
        today_str = today.strftime("%Y-%m-%d")

        # Current month cost
        resp = ce.get_cost_and_usage(
            TimePeriod={"Start": month_start, "End": today_str},
            Granularity="MONTHLY",
            Metrics=["UnblendedCost"],
        )
        current = round(float(resp["ResultsByTime"][0]["Total"]["UnblendedCost"]["Amount"]), 2)

        # Forecast to month end (may fail if no cost history)
        try:
            next_month = (today.replace(day=1) + timedelta(days=32)).replace(day=1)
            forecast_resp = ce.get_cost_forecast(
                TimePeriod={"Start": today_str, "End": next_month.strftime("%Y-%m-%d")},
                Metric="UNBLENDED_COST",
                Granularity="MONTHLY",
            )
            predicted = round(float(forecast_resp["Total"]["Amount"]), 2)
        except ClientError:
            predicted = current  # fallback to current if no forecast data

        # Last month cost for MoM change
        last_month_end = today.replace(day=1)
        last_month_start = (last_month_end - timedelta(days=1)).replace(day=1)
        prev_resp = ce.get_cost_and_usage(
            TimePeriod={
                "Start": last_month_start.strftime("%Y-%m-%d"),
                "End": last_month_end.strftime("%Y-%m-%d"),
            },
            Granularity="MONTHLY",
            Metrics=["UnblendedCost"],
        )
        prev = float(prev_resp["ResultsByTime"][0]["Total"]["UnblendedCost"]["Amount"])
        mom_change = round(((current - prev) / prev) * 100, 1) if prev > 0 else 0.0

        return {
            "currentMonthCost": current,
            "predictedMonthEnd": predicted,
            "budgetUtilization": 0,   # set via Budgets page
            "activeProjects": 0,
            "monthOverMonthChange": mom_change,
        }

    except (NoCredentialsError, ClientError) as e:
        raise HTTPException(status_code=502, detail=f"AWS error: {str(e)}")


# ============================================================================
# MOCK FALLBACKS
# ============================================================================

def _mock_monthly():
    return [
        {"month": "Aug", "cost": 4200, "predicted": 4100},
        {"month": "Sep", "cost": 4800, "predicted": 4600},
        {"month": "Oct", "cost": 5100, "predicted": 5000},
        {"month": "Nov", "cost": 4900, "predicted": 5200},
        {"month": "Dec", "cost": 5600, "predicted": 5400},
        {"month": "Jan", "cost": 6200, "predicted": 6100},
    ]

def _mock_services():
    return [
        {"service": "EC2", "cost": 2800, "percentage": 38},
        {"service": "RDS", "cost": 1400, "percentage": 19},
        {"service": "S3", "cost": 950, "percentage": 13},
        {"service": "Lambda", "cost": 720, "percentage": 10},
        {"service": "CloudFront", "cost": 580, "percentage": 8},
        {"service": "DynamoDB", "cost": 450, "percentage": 6},
        {"service": "Other", "cost": 300, "percentage": 4},
    ]

def _mock_daily():
    import random
    return [
        {"day": i + 1, "cost": round(180 + random.random() * 60 + (30 if i > 20 else 0), 2)}
        for i in range(30)
    ]

def _mock_stats():
    return {
        "currentMonthCost": 6200,
        "predictedMonthEnd": 6800,
        "budgetUtilization": 78,
        "activeProjects": 4,
        "monthOverMonthChange": 14,
    }


# ============================================================================
# ML INSIGHTS — forecast + anomalies + top drivers
# ============================================================================

@router.get("/ml-insights")
def get_ml_insights(role_arn: str = Query(default=None)):
    if not has_aws_credentials():
        return _mock_ml_insights()

    try:
        ce = get_ce_client(role_arn)
        today = datetime.today()
        month_start = today.replace(day=1).strftime("%Y-%m-%d")
        today_str = today.strftime("%Y-%m-%d")
        next_month = (today.replace(day=1) + timedelta(days=32)).replace(day=1)

        # Current month by service for top drivers
        svc_resp = ce.get_cost_and_usage(
            TimePeriod={"Start": month_start, "End": today_str},
            Granularity="MONTHLY",
            Metrics=["UnblendedCost"],
            GroupBy=[{"Type": "DIMENSION", "Key": "SERVICE"}],
        )
        groups = svc_resp["ResultsByTime"][0]["Groups"] if svc_resp["ResultsByTime"] else []
        items = sorted(
            [{"service": g["Keys"][0], "cost": float(g["Metrics"]["UnblendedCost"]["Amount"])}
             for g in groups if float(g["Metrics"]["UnblendedCost"]["Amount"]) > 0],
            key=lambda x: x["cost"], reverse=True
        )
        total = sum(i["cost"] for i in items) or 1
        top_drivers = [
            {"service": i["service"], "contribution": round((i["cost"] / total) * 100, 1), "change": 0}
            for i in items[:3]
        ]

        # Forecast for ML insights (may fail if no cost history)
        try:
            forecast_resp = ce.get_cost_forecast(
                TimePeriod={"Start": today_str, "End": next_month.strftime("%Y-%m-%d")},
                Metric="UNBLENDED_COST",
                Granularity="DAILY",
            )
            forecast = [
                {
                    "day": i + 1,
                    "actual": None,
                    "predicted": round(float(f["MeanValue"]), 2),
                    "lower": round(float(f["PredictionIntervalLowerBound"]), 2),
                    "upper": round(float(f["PredictionIntervalUpperBound"]), 2),
                }
                for i, f in enumerate(forecast_resp.get("ForecastResultsByTime", []))
            ]
        except ClientError:
            forecast = []

        # Last month for MoM
        last_end = today.replace(day=1)
        last_start = (last_end - timedelta(days=1)).replace(day=1)
        prev_resp = ce.get_cost_and_usage(
            TimePeriod={"Start": last_start.strftime("%Y-%m-%d"), "End": last_end.strftime("%Y-%m-%d")},
            Granularity="MONTHLY", Metrics=["UnblendedCost"],
        )
        prev_cost = float(prev_resp["ResultsByTime"][0]["Total"]["UnblendedCost"]["Amount"]) or 1
        current_cost = total
        trend = round(((current_cost - prev_cost) / prev_cost) * 100, 1)
        predicted_total = sum(f["predicted"] for f in forecast)

        explanation = (
            f"Your projected cost for this month is {abs(trend)}% "
            f"{'higher' if trend >= 0 else 'lower'} than last month. "
            f"Top driver is {top_drivers[0]['service']} at {top_drivers[0]['contribution']}% of total spend."
            if top_drivers else "No cost data available for this period."
        )

        return {
            "predictedCost": round(predicted_total, 2),
            "trendPercentage": trend,
            "topDrivers": top_drivers,
            "explanation": explanation,
            "forecast": forecast,
            "anomalies": [],
        }

    except (NoCredentialsError, ClientError) as e:
        raise HTTPException(status_code=502, detail=f"AWS error: {str(e)}")


def _mock_ml_insights():
    import random
    return {
        "predictedCost": 6800,
        "trendPercentage": 14,
        "topDrivers": [
            {"service": "EC2", "contribution": 45, "change": 18},
            {"service": "RDS", "contribution": 22, "change": 8},
            {"service": "Lambda", "contribution": 12, "change": 25},
        ],
        "explanation": "Your projected cost for this month is 14% higher than last month, primarily due to increased EC2 usage across production workloads.",
        "forecast": [
            {
                "day": i + 1,
                "actual": round(200 + random.random() * 40, 2) if i < 18 else None,
                "predicted": round(200 + i * 2 + random.random() * 20, 2),
                "lower": round(180 + i * 1.5, 2),
                "upper": round(230 + i * 2.5, 2),
            }
            for i in range(30)
        ],
        "anomalies": [
            {"service": "EC2", "date": "2026-02-15", "actual": 320, "expected": 220, "deviation": 45, "severity": "high"},
            {"service": "Lambda", "date": "2026-02-12", "actual": 85, "expected": 60, "deviation": 42, "severity": "medium"},
        ],
    }
