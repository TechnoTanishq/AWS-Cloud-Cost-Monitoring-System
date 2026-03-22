"""
AWS IAM / STS Integration
Validates and assumes a cross-account IAM role using STS.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import boto3
from botocore.exceptions import ClientError, NoCredentialsError
import os

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
def connect_aws_account(payload: ConnectRequest):
    if not payload.account_id.strip() or not payload.role_arn.strip():
        raise HTTPException(status_code=400, detail="account_id and role_arn are required")

    if not payload.account_id.strip().isdigit() or len(payload.account_id.strip()) != 12:
        raise HTTPException(status_code=400, detail="AWS Account ID must be 12 digits")

    try:
        sts = boto3.client(
            "sts",
            region_name=os.getenv("AWS_REGION", "us-east-1"),
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        )

        response = sts.assume_role(
            RoleArn=payload.role_arn.strip(),
            RoleSessionName="FinSightSession",
            ExternalId=EXTERNAL_ID,
            DurationSeconds=3600,
        )

        creds = response["Credentials"]

        # Verify the assumed identity
        assumed_sts = boto3.client(
            "sts",
            aws_access_key_id=creds["AccessKeyId"],
            aws_secret_access_key=creds["SecretAccessKey"],
            aws_session_token=creds["SessionToken"],
        )
        identity = assumed_sts.get_caller_identity()

        return {
            "connected": True,
            "account_id": identity["Account"],
            "arn": identity["Arn"],
            "message": "AWS account connected successfully via IAM role.",
        }

    except ClientError as e:
        code = e.response["Error"]["Code"]
        msg = e.response["Error"]["Message"]
        raise HTTPException(status_code=400, detail=f"AWS error ({code}): {msg}")
    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="FinSight AWS credentials not configured.")
