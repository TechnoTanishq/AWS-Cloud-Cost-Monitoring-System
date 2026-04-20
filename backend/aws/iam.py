"""
AWS IAM / STS Integration
Validates and assumes a cross-account IAM role using STS.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import boto3
from botocore.exceptions import ClientError, NoCredentialsError
import os
from sqlalchemy.orm import Session
from database import get_db
from models.aws_account import AWSAccount
from auth.dependencies import get_current_user
from redis_client_cnf import redis_client

router = APIRouter()

EXTERNAL_ID = "finsight-ext-a3b7c9d2e4f6"


@router.get("/info")
def get_iam_info():
    """Return FinSight backend AWS account ID and external ID for user setup."""
    try:
        # Get the backend's AWS account ID
        sts = boto3.client(
            "sts",
            region_name=os.getenv("AWS_REGION", "us-east-1"),
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        )
        identity = sts.get_caller_identity()
        return {
            "account_id": identity["Account"],
            "external_id": EXTERNAL_ID,
            "arn": identity["Arn"],
        }
    except (ClientError, NoCredentialsError):
        # If credentials not configured, return placeholder
        return {
            "account_id": "NOT_CONFIGURED",
            "external_id": EXTERNAL_ID,
            "arn": "Backend AWS credentials not configured",
        }


class ConnectRequest(BaseModel):
    account_id: str
    role_arn: str


@router.post("/connect")
def connect_aws_account(
    payload: ConnectRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    try:
        sts = boto3.client(
            "sts",
            region_name=os.getenv("AWS_REGION", "us-east-1"),
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        )

        sts.assume_role(
            RoleArn=payload.role_arn,
            RoleSessionName="FinSightSession",
            ExternalId=EXTERNAL_ID,
        )

        # ✅ STORE IN DB
        existing = db.query(AWSAccount).filter_by(user_id=user["id"]).first()

        if existing:
            existing.account_id = payload.account_id
            existing.role_arn = payload.role_arn
        else:
            new_acc = AWSAccount(
                user_id=user["id"],
                account_id=payload.account_id,
                role_arn=payload.role_arn
            )
            db.add(new_acc)

        db.commit()

        # Invalidate cached cost data so real data loads immediately
        for key in ["monthly", "service", "daily", "stats", "ml"]:
            redis_client.delete(f"cost:{key}:{user['id']}")

        return {"connected": True}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/connection")
def get_connection(db: Session = Depends(get_db), user=Depends(get_current_user)):
    aws_account = db.query(AWSAccount).filter_by(user_id=user["id"]).first()

    if not aws_account:
        return {"connected": False}

    return {
        "connected": True,
        "account_id": aws_account.account_id,
        "role_arn": aws_account.role_arn,
    }

@router.delete("/disconnect")
def disconnect_aws(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    aws = db.query(AWSAccount).filter_by(user_id=user["id"]).first()

    if aws:
        db.delete(aws)
        db.commit()
        # Invalidate cache on disconnect too
        for key in ["monthly", "service", "daily", "stats", "ml"]:
            redis_client.delete(f"cost:{key}:{user['id']}")

    return {"message": "Disconnected"}