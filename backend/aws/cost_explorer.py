"""
AWS Cost Explorer Routes (OPTIMIZED + REDIS CACHED)
"""

from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta
import os
import boto3
import logging
from botocore.exceptions import NoCredentialsError, ClientError
from sqlalchemy.orm import Session
import json

from redis_client_cnf import redis_client
from database import get_db
from models.aws_account import AWSAccount
from auth.dependencies import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter()

EXTERNAL_ID = "finsight-ext-a3b7c9d2e4f6"


# ============================================================================
# 🔐 STS + CE CLIENT (CACHED)
# ============================================================================

def get_ce_client(role_arn: str):
    cache_key = f"sts:{role_arn}"

    cached = redis_client.get(cache_key)

    if cached:
        print("✅ Using cached STS credentials")
        creds = json.loads(cached)
    else:
        print("❗ Calling STS AssumeRole")

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

        redis_client.setex(
            cache_key,
            3600,
            json.dumps(creds, default=str)
        )

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
# 📊 GENERIC CACHE HELPER (IMPORTANT 🔥)
# ============================================================================

def get_or_set_cache(cache_key, ttl, fetch_function):
    cached = redis_client.get(cache_key)

    if cached:
        print(f"✅ Cache HIT: {cache_key}")
        return json.loads(cached)

    print(f"❗ Cache MISS: {cache_key}")

    data = fetch_function()

    redis_client.setex(cache_key, ttl, json.dumps(data))

    return data


# ============================================================================
# 📊 MONTHLY COSTS
# ============================================================================

@router.get("/monthly")
def get_monthly_costs(db: Session = Depends(get_db), user=Depends(get_current_user)):
    aws_account = db.query(AWSAccount).filter_by(user_id=user["id"]).first()
    if not aws_account or not has_aws_credentials():
        return _mock_monthly()

    def fetch():
        ce = get_ce_client(aws_account.role_arn)
        end = datetime.today().replace(day=1)
        start = (end - timedelta(days=180)).replace(day=1)
        resp = ce.get_cost_and_usage(
            TimePeriod={"Start": start.strftime("%Y-%m-%d"), "End": end.strftime("%Y-%m-%d")},
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

    try:
        return get_or_set_cache(f"cost:monthly:{user['id']}", 1800, fetch)
    except ClientError as e:
        if e.response["Error"]["Code"] == "DataUnavailableException":
            return _mock_monthly()
        raise HTTPException(status_code=502, detail=str(e))
    except NoCredentialsError as e:
        raise HTTPException(status_code=502, detail=str(e))


# ============================================================================
# 📦 SERVICE COSTS
# ============================================================================

@router.get("/by-service")
def get_service_costs(db: Session = Depends(get_db), user=Depends(get_current_user)):
    aws_account = db.query(AWSAccount).filter_by(user_id=user["id"]).first()
    if not aws_account or not has_aws_credentials():
        return _mock_services()

    def fetch():
        ce = get_ce_client(aws_account.role_arn)
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
            for g in groups if float(g["Metrics"]["UnblendedCost"]["Amount"]) > 0
        ]
        items.sort(key=lambda x: x["cost"], reverse=True)
        total = sum(i["cost"] for i in items) or 1
        for item in items:
            item["percentage"] = round((item["cost"] / total) * 100, 1)
        return items

    try:
        return get_or_set_cache(f"cost:service:{user['id']}", 1800, fetch)
    except ClientError as e:
        if e.response["Error"]["Code"] == "DataUnavailableException":
            return _mock_services()
        raise HTTPException(status_code=502, detail=str(e))
    except NoCredentialsError as e:
        raise HTTPException(status_code=502, detail=str(e))


# ============================================================================
# 📅 DAILY COSTS
# ============================================================================

@router.get("/daily")
def get_daily_costs(db: Session = Depends(get_db), user=Depends(get_current_user)):
    aws_account = db.query(AWSAccount).filter_by(user_id=user["id"]).first()
    if not aws_account or not has_aws_credentials():
        return _mock_daily()

    def fetch():
        ce = get_ce_client(aws_account.role_arn)
        end = datetime.today()
        start = end - timedelta(days=30)
        resp = ce.get_cost_and_usage(
            TimePeriod={"Start": start.strftime("%Y-%m-%d"), "End": end.strftime("%Y-%m-%d")},
            Granularity="DAILY",
            Metrics=["UnblendedCost"],
        )
        return [
            {"day": i + 1, "date": item["TimePeriod"]["Start"],
             "cost": round(float(item["Total"]["UnblendedCost"]["Amount"]), 2)}
            for i, item in enumerate(resp["ResultsByTime"])
        ]

    try:
        return get_or_set_cache(f"cost:daily:{user['id']}", 1800, fetch)
    except ClientError as e:
        if e.response["Error"]["Code"] == "DataUnavailableException":
            return _mock_daily()
        raise HTTPException(status_code=502, detail=str(e))
    except NoCredentialsError as e:
        raise HTTPException(status_code=502, detail=str(e))


# ============================================================================
# 📊 STATS
# ============================================================================

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db), user=Depends(get_current_user)):
    aws_account = db.query(AWSAccount).filter_by(user_id=user["id"]).first()
    if not aws_account or not has_aws_credentials():
        return _mock_stats()

    def fetch():
        ce = get_ce_client(aws_account.role_arn)
        today = datetime.today()
        month_start = today.replace(day=1).strftime("%Y-%m-%d")
        today_str = today.strftime("%Y-%m-%d")
        current_month_key = today.strftime("%Y-%m")

        # ── Current month cost ────────────────────────────────────────────
        resp = ce.get_cost_and_usage(
            TimePeriod={"Start": month_start, "End": today_str},
            Granularity="MONTHLY",
            Metrics=["UnblendedCost"],
        )
        current = round(float(resp["ResultsByTime"][0]["Total"]["UnblendedCost"]["Amount"]), 2)

        # ── Last month cost for real MoM ──────────────────────────────────
        last_end = today.replace(day=1)
        last_start = (last_end - timedelta(days=1)).replace(day=1)
        prev_resp = ce.get_cost_and_usage(
            TimePeriod={"Start": last_start.strftime("%Y-%m-%d"), "End": last_end.strftime("%Y-%m-%d")},
            Granularity="MONTHLY",
            Metrics=["UnblendedCost"],
        )
        prev = float(prev_resp["ResultsByTime"][0]["Total"]["UnblendedCost"]["Amount"])
        mom_change = round(((current - prev) / prev) * 100, 1) if prev > 0 else 0.0

        # ── Predicted month-end ───────────────────────────────────────────
        days_in_month = (today.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)
        predicted = round(current * (days_in_month.day / max(today.day, 1)), 2)

        # ── Budget utilization from DB ────────────────────────────────────
        budget_row = db.query(AWSAccount.__class__).filter_by if False else None  # placeholder
        from models.db_models import Budget
        budget_row = db.query(Budget).filter_by(
            user_id=user["id"],
            month=current_month_key
        ).first()
        budget_utilization = 0
        if budget_row and budget_row.amount > 0:
            budget_utilization = round((current / budget_row.amount) * 100, 1)

        return {
            "currentMonthCost": current,
            "predictedMonthEnd": predicted,
            "monthOverMonthChange": mom_change,
            "budgetUtilization": budget_utilization,
            "activeProjects": 0,
        }

    try:
        # Don't cache stats — budget can change anytime
        return fetch()
    except ClientError as e:
        if e.response["Error"]["Code"] == "DataUnavailableException":
            return _mock_stats()
        raise HTTPException(status_code=502, detail=str(e))
    except NoCredentialsError as e:
        raise HTTPException(status_code=502, detail=str(e))




# ============================================================================
#  ML INSIGHTS
# ============================================================================

@router.get("/ml-insights")
def get_ml_insights(db: Session = Depends(get_db), user=Depends(get_current_user)):
    aws_account = db.query(AWSAccount).filter_by(user_id=user["id"]).first()
    if not aws_account or not has_aws_credentials():
        return _mock_ml_insights()

    def fetch():
        ce = get_ce_client(aws_account.role_arn)
        today = datetime.today()
        month_start = today.replace(day=1)
        today_str = today.strftime("%Y-%m-%d")
        month_start_str = month_start.strftime("%Y-%m-%d")

        # Last month boundaries
        last_month_end = month_start
        last_month_start = (last_month_end - timedelta(days=1)).replace(day=1)

        # ── Current month by service ──────────────────────────────────────
        svc_resp = ce.get_cost_and_usage(
            TimePeriod={"Start": month_start_str, "End": today_str},
            Granularity="MONTHLY",
            Metrics=["UnblendedCost"],
            GroupBy=[{"Type": "DIMENSION", "Key": "SERVICE"}],
        )
        curr_groups = svc_resp["ResultsByTime"][0]["Groups"] if svc_resp["ResultsByTime"] else []
        curr_by_svc = {
            g["Keys"][0]: round(float(g["Metrics"]["UnblendedCost"]["Amount"]), 2)
            for g in curr_groups if float(g["Metrics"]["UnblendedCost"]["Amount"]) > 0
        }
        current_total = sum(curr_by_svc.values()) or 1

        # ── Last month by service (for MoM per service + anomaly baseline) ─
        prev_svc_resp = ce.get_cost_and_usage(
            TimePeriod={
                "Start": last_month_start.strftime("%Y-%m-%d"),
                "End": last_month_end.strftime("%Y-%m-%d"),
            },
            Granularity="MONTHLY",
            Metrics=["UnblendedCost"],
            GroupBy=[{"Type": "DIMENSION", "Key": "SERVICE"}],
        )
        prev_groups = prev_svc_resp["ResultsByTime"][0]["Groups"] if prev_svc_resp["ResultsByTime"] else []
        prev_by_svc = {
            g["Keys"][0]: round(float(g["Metrics"]["UnblendedCost"]["Amount"]), 2)
            for g in prev_groups if float(g["Metrics"]["UnblendedCost"]["Amount"]) > 0
        }
        prev_total = sum(prev_by_svc.values()) or 1

        # ── Overall MoM trend ─────────────────────────────────────────────
        trend = round(((current_total - prev_total) / prev_total) * 100, 1)

        # ── Top drivers with real MoM change ─────────────────────────────
        sorted_svcs = sorted(curr_by_svc.items(), key=lambda x: x[1], reverse=True)
        top_drivers = []
        for svc, cost in sorted_svcs[:5]:
            contribution = round((cost / current_total) * 100, 1)
            prev_cost = prev_by_svc.get(svc, 0)
            change = round(((cost - prev_cost) / prev_cost) * 100, 1) if prev_cost > 0 else 0.0
            top_drivers.append({"service": svc, "contribution": contribution, "change": change, "cost": cost})

        # ── Anomaly detection: service cost > 150% of last month ─────────
        anomalies = []
        for svc, cost in curr_by_svc.items():
            prev = prev_by_svc.get(svc, 0)
            if prev > 0:
                deviation = round(((cost - prev) / prev) * 100, 1)
                if deviation > 50:
                    severity = "high" if deviation > 100 else "medium"
                    anomalies.append({
                        "service": svc,
                        "date": today_str,
                        "actual": cost,
                        "expected": prev,
                        "deviation": deviation,
                        "severity": severity,
                    })
        anomalies.sort(key=lambda x: x["deviation"], reverse=True)

        # ── Forecast: project remaining days of month ─────────────────────
        days_elapsed = today.day
        days_in_month = (month_start.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)
        daily_avg = current_total / days_elapsed if days_elapsed > 0 else 0
        predicted_total = round(daily_avg * days_in_month.day, 2)

        # Build daily forecast array
        try:
            next_month = (month_start + timedelta(days=32)).replace(day=1)
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
            # Fallback: linear projection
            forecast = [
                {
                    "day": i + 1,
                    "actual": None,
                    "predicted": round(daily_avg * (1 + (i * 0.01)), 2),
                    "lower": round(daily_avg * 0.85, 2),
                    "upper": round(daily_avg * 1.15, 2),
                }
                for i in range(days_in_month.day - days_elapsed)
            ]

        # ── Daily actuals for the current month ───────────────────────────
        daily_resp = ce.get_cost_and_usage(
            TimePeriod={"Start": month_start_str, "End": today_str},
            Granularity="DAILY",
            Metrics=["UnblendedCost"],
        )
        daily_actuals = [
            {
                "day": i + 1,
                "actual": round(float(item["Total"]["UnblendedCost"]["Amount"]), 2),
                "predicted": None,
                "lower": None,
                "upper": None,
            }
            for i, item in enumerate(daily_resp["ResultsByTime"])
        ]

        # Merge actuals + forecast into one timeline
        combined_forecast = daily_actuals + forecast

        # ── Savings opportunity ───────────────────────────────────────────
        savings = round(max(predicted_total - current_total, 0) * 0.15, 2)

        # ── AI explanation ────────────────────────────────────────────────
        top_svc = top_drivers[0]["service"] if top_drivers else "N/A"
        top_pct = top_drivers[0]["contribution"] if top_drivers else 0
        top_change = top_drivers[0]["change"] if top_drivers else 0
        direction = "higher" if trend >= 0 else "lower"
        anomaly_note = (
            f" {len(anomalies)} anomal{'y' if len(anomalies)==1 else 'ies'} detected — "
            f"{anomalies[0]['service']} is {anomalies[0]['deviation']}% above last month."
            if anomalies else " No anomalies detected this period."
        )
        explanation = (
            f"Your spend this month is {abs(trend)}% {direction} than last month. "
            f"{top_svc} is your top cost driver at {top_pct}% of total spend"
            f"{f', up {top_change}% MoM' if top_change > 0 else ''}."
            f"{anomaly_note}"
        )

        return {
            "predictedCost": predicted_total,
            "trendPercentage": trend,
            "topDrivers": top_drivers,
            "explanation": explanation,
            "forecast": combined_forecast,
            "anomalies": anomalies,
            "savingsOpportunity": savings,
            "currentMonthCost": round(current_total, 2),
        }

    try:
        return get_or_set_cache(f"cost:ml:{user['id']}", 1800, fetch)
    except ClientError as e:
        if e.response["Error"]["Code"] == "DataUnavailableException":
            logger.warning("ML insights data not yet available — returning mock")
            return _mock_ml_insights()
        raise HTTPException(status_code=502, detail=str(e))
    except NoCredentialsError as e:
        raise HTTPException(status_code=502, detail=str(e))

# ============================================================================
# MOCKS
# ============================================================================

def _mock_monthly():
    return {"mock": True, "data": [
        {"month": "Aug", "cost": 4200, "predicted": 4100},
        {"month": "Sep", "cost": 4800, "predicted": 4600},
        {"month": "Oct", "cost": 5100, "predicted": 5000},
        {"month": "Nov", "cost": 4900, "predicted": 5200},
        {"month": "Dec", "cost": 5600, "predicted": 5400},
        {"month": "Jan", "cost": 6200, "predicted": 6100},
    ]}

def _mock_services():
    return {"mock": True, "data": [
        {"service": "EC2", "cost": 2800, "percentage": 38},
        {"service": "RDS", "cost": 1400, "percentage": 19},
        {"service": "S3", "cost": 950, "percentage": 13},
        {"service": "Lambda", "cost": 720, "percentage": 10},
        {"service": "CloudFront", "cost": 580, "percentage": 8},
        {"service": "DynamoDB", "cost": 450, "percentage": 6},
        {"service": "Other", "cost": 300, "percentage": 4},
    ]}

def _mock_daily():
    import random
    return {"mock": True, "data": [
        {"day": i + 1, "cost": round(180 + random.random() * 60 + (30 if i > 20 else 0), 2)}
        for i in range(30)
    ]}

def _mock_stats():
    return {
        "mock": True,
        "currentMonthCost": 6200,
        "predictedMonthEnd": 6800,
        "budgetUtilization": 0,
        "activeProjects": 0,
        "monthOverMonthChange": 14,
    }

def _mock_ml_insights():
    import random
    random.seed(42)
    actuals = [
        {"day": i + 1, "actual": round(180 + random.random() * 60 + (i * 2.5), 2),
         "predicted": None, "lower": None, "upper": None}
        for i in range(18)
    ]
    forecast = [
        {"day": i + 19, "actual": None,
         "predicted": round(230 + i * 3 + random.random() * 20, 2),
         "lower": round(200 + i * 2, 2),
         "upper": round(260 + i * 4, 2)}
        for i in range(13)
    ]
    return {
        "mock": True,
        "predictedCost": 6800,
        "currentMonthCost": 4100,
        "trendPercentage": 14,
        "savingsOpportunity": 420,
        "topDrivers": [
            {"service": "EC2", "contribution": 45, "change": 18, "cost": 2800},
            {"service": "RDS", "contribution": 22, "change": 8, "cost": 1400},
            {"service": "Lambda", "contribution": 12, "change": 25, "cost": 720},
            {"service": "S3", "contribution": 10, "change": -3, "cost": 620},
            {"service": "CloudFront", "contribution": 11, "change": 5, "cost": 560},
        ],
        "explanation": "Sample data — connect your AWS account to see real AI-powered insights.",
        "forecast": actuals + forecast,
        "anomalies": [
            {"service": "EC2", "date": "2026-04-15", "actual": 320, "expected": 190,
             "deviation": 68, "severity": "high"},
            {"service": "Lambda", "date": "2026-04-12", "actual": 85, "expected": 52,
             "deviation": 63, "severity": "medium"},
        ],
    }