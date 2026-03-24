# AWS Account Connection Guide

This guide explains how to connect any AWS account to FinSight for real-time cost monitoring.

## Architecture Overview

FinSight uses **IAM Role Assumption** for secure, multi-account access:

1. **Backend Service Account**: FinSight backend has base AWS credentials (in `.env`)
2. **User IAM Roles**: Each user creates a role in their AWS account that trusts FinSight
3. **STS AssumeRole**: Backend assumes user roles to fetch their specific cost data
4. **No Credential Storage**: User AWS keys are never stored or requested

---

## Part 1: Setup FinSight Backend (One-Time)

### Step 1: Create FinSight Service Account

In **your AWS account** (the one hosting FinSight):

1. Go to **IAM** → **Users** → **Create user**
2. User name: `finsight-backend-service`
3. Click **Next** → **Attach policies directly**
4. Click **Create policy** → JSON tab:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "*"
    }
  ]
}
```

5. Name: `FinSightAssumeRolePolicy` → **Create policy**
6. Go back, attach `FinSightAssumeRolePolicy` → **Create user**

### Step 2: Generate Access Keys

1. Click on `finsight-backend-service` user
2. **Security credentials** tab → **Create access key**
3. Select **Application running outside AWS** → **Create**
4. Copy both keys

### Step 3: Update Backend .env

Edit `backend/.env`:

```env
AWS_ACCESS_KEY_ID=AKIA...your-key-here
AWS_SECRET_ACCESS_KEY=your-secret-key-here
AWS_REGION=us-east-1
```

### Step 4: Restart Backend

```bash
cd backend
python main.py
```

---

## Part 2: Connect User AWS Accounts (Per User)

Each user follows these steps to connect their AWS account:

### Step 1: Enable Cost Explorer

1. Log into **AWS Console** → **Billing and Cost Management**
2. Click **Cost Explorer** → **Enable Cost Explorer**
3. Wait 24 hours for data to populate

### Step 2: Create IAM Role

1. Go to **IAM** → **Roles** → **Create role**
2. Select **AWS account** → **Another AWS account**
3. Account ID: `YOUR_FINSIGHT_BACKEND_ACCOUNT_ID` (the account from Part 1)
4. Check **Require external ID** → Enter: `finsight-ext-a3b7c9d2e4f6`
5. Click **Next**

### Step 3: Attach Permissions

1. Search and select: `AWSBillingReadOnlyAccess`
2. Click **Next**
3. Role name: `FinSightRole`
4. Click **Create role**

### Step 4: Copy Role ARN

1. Click on `FinSightRole`
2. Copy the **ARN** (looks like: `arn:aws:iam::123456789012:role/FinSightRole`)

### Step 5: Connect in FinSight

1. Go to **IAM Integration** page in FinSight
2. Enter your **AWS Account ID** (12 digits)
3. Paste the **Role ARN**
4. Click **Connect AWS Account**

---

## Verification

After connecting, go to **Dashboard** — you should see:
- Real monthly cost trends
- Service-wise breakdown
- Daily cost data
- ML-powered insights

---

## Troubleshooting

### "NoCredentialsError" in backend logs
- Backend `.env` is missing AWS credentials
- Follow Part 1 to set up service account

### "Access Denied" when connecting
- Trust policy is incorrect
- Verify External ID: `finsight-ext-a3b7c9d2e4f6`
- Verify trusted account ID matches your FinSight backend account

### "No data available"
- Cost Explorer needs 24 hours after enabling
- Verify you have actual AWS usage/costs

### 502 Bad Gateway
- Backend can't assume the role
- Check role ARN is correct
- Verify `AWSBillingReadOnlyAccess` is attached

---

## Security Notes

✅ **Secure**: Uses IAM role assumption with external ID
✅ **No Keys Stored**: User AWS keys are never requested or stored
✅ **Temporary Credentials**: STS provides 1-hour temporary credentials
✅ **Read-Only**: Only billing/cost data access, no write permissions
✅ **Auditable**: All access logged in AWS CloudTrail

---

## Multi-Account Support

FinSight supports unlimited AWS accounts:
- Each user connects their own account via IAM Integration
- Data is isolated per user session
- Role ARN is passed with each API request
- No cross-account data leakage
