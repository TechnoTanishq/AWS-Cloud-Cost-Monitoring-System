# IAM Integration - Technical Explanation

## Overview

The IAM Integration feature allows FinSight to securely access AWS Cost Explorer data from user accounts **without storing AWS credentials**. It uses AWS IAM Role Assumption with STS (Security Token Service) for secure, temporary access.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's AWS Account                       │
│                         (222222222222)                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  IAM Role: FinSightRole                                   │  │
│  │  ─────────────────────────────────────────────────────    │  │
│  │  Trust Policy:                                            │  │
│  │    - Trusted Entity: 111111111111 (FinSight Backend)     │  │
│  │    - External ID: finsight-ext-a3b7c9d2e4f6              │  │
│  │                                                            │  │
│  │  Permissions:                                             │  │
│  │    - AWSBillingReadOnlyAccess                            │  │
│  │    - ce:GetCostAndUsage                                   │  │
│  │    - ce:GetCostForecast                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ▲                                   │
│                              │ 3. AssumeRole                     │
│                              │    (with External ID)             │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                              │                                    │
│                    FinSight Backend                              │
│                    (111111111111)                                │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  IAM User: finsight-backend-service                        │ │
│  │  ──────────────────────────────────────────────────────    │ │
│  │  Permissions:                                              │ │
│  │    - sts:AssumeRole                                        │ │
│  │                                                             │ │
│  │  Credentials stored in .env:                               │ │
│  │    - AWS_ACCESS_KEY_ID                                     │ │
│  │    - AWS_SECRET_ACCESS_KEY                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              │ 2. Request with Role ARN           │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Backend API: /iam/connect                                 │ │
│  │  ──────────────────────────────────────────────────────    │ │
│  │  1. Receives: account_id, role_arn                         │ │
│  │  2. Calls: sts.assume_role()                               │ │
│  │  3. Returns: Temporary credentials (1 hour)                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              │ 4. Temporary Credentials           │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Cost Explorer API Calls                                   │ │
│  │  ──────────────────────────────────────────────────────    │ │
│  │  - GET /costs/monthly                                      │ │
│  │  - GET /costs/by-service                                   │ │
│  │  - GET /costs/stats                                        │ │
│  │  - GET /costs/ml-insights                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               │ 5. Cost Data Response
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (React)                            │
│                                                                   │
│  1. User fills IAM Integration form                              │
│  2. POST /iam/connect → Backend                                  │
│  3. Store connection in localStorage                             │
│  4. Dashboard fetches data with role_arn query param             │
│  5. Display real-time AWS cost data                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Details

### 1. Frontend Implementation

#### File: `frontend/src/pages/IAMIntegration.tsx`

**Key Features:**
- Displays FinSight backend account ID (fetched from `/iam/info`)
- Shows External ID for user to copy
- Form to collect user's AWS Account ID and Role ARN
- Validates connection by calling backend API
- Stores connection details in localStorage

**Code Flow:**
```typescript
// 1. Fetch FinSight backend account ID
useEffect(() => {
  fetch(`${API}/iam/info`)
    .then(r => r.json())
    .then(data => setBackendAccountId(data.account_id));
}, []);

// 2. User submits connection form
const handleConnect = async () => {
  const result = await connect(accountId, roleArn);
  if (result.ok) {
    // Connection stored in localStorage
    toast.success("AWS account connected successfully.");
  }
};
```

#### File: `frontend/src/contexts/AwsContext.tsx`

**Purpose:** Manages AWS connection state across the app

**Key Functions:**
```typescript
// Store connection details
const connect = async (accountId: string, roleArn: string) => {
  const res = await fetch(`${API}/iam/connect`, {
    method: "POST",
    body: JSON.stringify({ account_id: accountId, role_arn: roleArn }),
  });
  
  const conn = { accountId, roleArn, arn: data.arn };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conn));
  return { ok: true };
};

// Disconnect (remove from localStorage)
const disconnect = () => {
  setConnection(null);
  localStorage.removeItem(STORAGE_KEY);
};
```

#### File: `frontend/src/hooks/useAwsData.ts`

**Purpose:** Fetch cost data with role ARN

**Implementation:**
```typescript
function buildUrl(path, roleArn) {
  if (roleArn) {
    return API + path + "?role_arn=" + encodeURIComponent(roleArn);
  }
  return API + path;
}

// Usage: GET /costs/stats?role_arn=arn:aws:iam::222222222222:role/FinSightRole
export const useDashboardStats = (roleArn) => 
  useFetch(buildUrl("/costs/stats", roleArn));
```

---

### 2. Backend Implementation

#### File: `backend/aws/iam.py`

**Endpoint 1: GET /iam/info**

Returns FinSight backend account ID for users to configure trust policy:

```python
@router.get("/info")
def get_iam_info():
    sts = boto3.client("sts",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    )
    identity = sts.get_caller_identity()
    return {
        "account_id": identity["Account"],  # e.g., "111111111111"
        "external_id": EXTERNAL_ID,         # "finsight-ext-a3b7c9d2e4f6"
    }
```

**Endpoint 2: POST /iam/connect**

Validates user's IAM role by attempting to assume it:

```python
@router.post("/connect")
def connect_aws_account(payload: ConnectRequest):
    # 1. Validate input
    if not payload.account_id.isdigit() or len(payload.account_id) != 12:
        raise HTTPException(400, "Invalid Account ID")
    
    # 2. Attempt to assume user's role
    sts = boto3.client("sts",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    )
    
    response = sts.assume_role(
        RoleArn=payload.role_arn,           # User's role
        RoleSessionName="FinSightSession",
        ExternalId=EXTERNAL_ID,             # Security check
        DurationSeconds=3600,               # 1 hour
    )
    
    # 3. Verify assumed identity
    creds = response["Credentials"]
    assumed_sts = boto3.client("sts",
        aws_access_key_id=creds["AccessKeyId"],
        aws_secret_access_key=creds["SecretAccessKey"],
        aws_session_token=creds["SessionToken"],
    )
    identity = assumed_sts.get_caller_identity()
    
    # 4. Return success
    return {
        "connected": True,
        "account_id": identity["Account"],
        "arn": identity["Arn"],
    }
```

#### File: `backend/aws/cost_explorer.py`

**Cost Data Endpoints with Role Assumption:**

```python
def get_ce_client(role_arn: str = None):
    """Get Cost Explorer client with role assumption"""
    if role_arn:
        # Assume user's role
        sts = boto3.client("sts",
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
        
        # Return CE client with temporary credentials
        return boto3.client("ce",
            region_name="us-east-1",
            aws_access_key_id=creds["AccessKeyId"],
            aws_secret_access_key=creds["SecretAccessKey"],
            aws_session_token=creds["SessionToken"],
        )
    
    # Fallback: use backend credentials directly
    return boto3.client("ce",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    )

@router.get("/monthly")
def get_monthly_costs(role_arn: str = Query(default=None)):
    ce = get_ce_client(role_arn)  # Assumes role if provided
    
    # Fetch cost data using temporary credentials
    resp = ce.get_cost_and_usage(
        TimePeriod={"Start": start, "End": end},
        Granularity="MONTHLY",
        Metrics=["UnblendedCost"],
    )
    
    return process_results(resp)
```

---

## Security Features

### 1. External ID (Confused Deputy Prevention)

**Problem:** Without External ID, any AWS account could try to assume your role.

**Solution:** External ID acts as a shared secret:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "AWS": "arn:aws:iam::111111111111:user/finsight-backend-service"
    },
    "Action": "sts:AssumeRole",
    "Condition": {
      "StringEquals": {
        "sts:ExternalId": "finsight-ext-a3b7c9d2e4f6"
      }
    }
  }]
}
```

Only requests with the correct External ID can assume the role.

### 2. Temporary Credentials

- **Duration:** 1 hour (3600 seconds)
- **Auto-expiry:** Credentials become invalid after 1 hour
- **No storage:** Credentials are never stored, regenerated on each request

### 3. Read-Only Access

The IAM role only has `AWSBillingReadOnlyAccess`:
- ✅ Can read: Cost data, billing info
- ❌ Cannot: Create resources, delete data, modify anything

### 4. Principle of Least Privilege

Backend IAM user only has `sts:AssumeRole` permission:
- ✅ Can: Assume roles in other accounts
- ❌ Cannot: Access EC2, S3, or any other AWS services directly

---

## Data Flow Example

### Scenario: User loads Dashboard

```
1. Frontend: GET /dashboard
   └─> Reads roleArn from localStorage: "arn:aws:iam::222222222222:role/FinSightRole"

2. Frontend: GET /costs/stats?role_arn=arn:aws:iam::222222222222:role/FinSightRole
   │
   ├─> Backend receives request
   │
   ├─> Backend calls AWS STS:
   │   sts.assume_role(
   │     RoleArn="arn:aws:iam::222222222222:role/FinSightRole",
   │     ExternalId="finsight-ext-a3b7c9d2e4f6"
   │   )
   │
   ├─> AWS validates:
   │   - Is the caller (111111111111) trusted? ✓
   │   - Is the External ID correct? ✓
   │   - Does the role exist? ✓
   │
   ├─> AWS returns temporary credentials:
   │   {
   │     "AccessKeyId": "ASIA...",
   │     "SecretAccessKey": "...",
   │     "SessionToken": "...",
   │     "Expiration": "2026-03-20T15:30:00Z"
   │   }
   │
   ├─> Backend uses temporary credentials to call Cost Explorer:
   │   ce.get_cost_and_usage(...)
   │
   ├─> Cost Explorer returns data from account 222222222222
   │
   └─> Backend returns cost data to frontend

3. Frontend: Displays real-time cost data on dashboard
```

---

## Multi-Account Support

The same backend can serve multiple users with different AWS accounts:

```
User A (Account 111111111111):
  └─> Role ARN: arn:aws:iam::111111111111:role/FinSightRole
      └─> Dashboard shows User A's costs

User B (Account 222222222222):
  └─> Role ARN: arn:aws:iam::222222222222:role/FinSightRole
      └─> Dashboard shows User B's costs

User C (Account 333333333333):
  └─> Role ARN: arn:aws:iam::333333333333:role/FinSightRole
      └─> Dashboard shows User C's costs
```

Each user's data is isolated because:
1. Role ARN is passed with each request
2. Backend assumes the specific user's role
3. Cost Explorer returns data only from that account

---

## Error Handling

### Common Errors and Solutions

**1. "Access Denied" when assuming role**

**Cause:** Trust policy doesn't allow FinSight backend to assume the role

**Solution:**
```bash
# Check trust policy
aws iam get-role --role-name FinSightRole --query 'Role.AssumeRolePolicyDocument'

# Verify:
# - Trusted account ID matches FinSight backend
# - External ID is correct
```

**2. "Role not found"**

**Cause:** Role ARN is incorrect or role was deleted

**Solution:**
```bash
# List roles
aws iam list-roles --query 'Roles[?RoleName==`FinSightRole`]'

# Verify Role ARN format:
# arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME
```

**3. "Cost Explorer not enabled"**

**Cause:** Cost Explorer is disabled in the user's account

**Solution:**
```bash
# Enable Cost Explorer (takes 24 hours to populate data)
AWS Console → Billing → Cost Explorer → Enable
```

---

## Testing the Integration

### 1. Test Backend Account ID Endpoint

```bash
curl http://localhost:8000/iam/info
```

Expected response:
```json
{
  "account_id": "111111111111",
  "external_id": "finsight-ext-a3b7c9d2e4f6",
  "arn": "arn:aws:iam::111111111111:user/finsight-backend-service"
}
```

### 2. Test Role Assumption

```bash
curl -X POST http://localhost:8000/iam/connect \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": "222222222222",
    "role_arn": "arn:aws:iam::222222222222:role/FinSightRole"
  }'
```

Expected response:
```json
{
  "connected": true,
  "account_id": "222222222222",
  "arn": "arn:aws:sts::222222222222:assumed-role/FinSightRole/FinSightSession"
}
```

### 3. Test Cost Data Fetch

```bash
curl "http://localhost:8000/costs/stats?role_arn=arn:aws:iam::222222222222:role/FinSightRole"
```

Expected response:
```json
{
  "currentMonthCost": 2.33,
  "predictedMonthEnd": 2.74,
  "budgetUtilization": 0,
  "activeProjects": 0,
  "monthOverMonthChange": 0
}
```

---

## Advantages of This Approach

✅ **Secure:** No AWS credentials stored or transmitted  
✅ **Scalable:** Supports unlimited user accounts  
✅ **Auditable:** All access logged in AWS CloudTrail  
✅ **Revocable:** User can delete role to revoke access instantly  
✅ **Temporary:** Credentials expire after 1 hour  
✅ **Read-only:** Cannot modify or delete AWS resources  
✅ **Industry standard:** Used by Datadog, New Relic, CloudHealth  

---

## Comparison with Alternative Approaches

| Approach | Security | Scalability | User Experience |
|----------|----------|-------------|-----------------|
| **IAM Role Assumption** (Current) | ✅ Excellent | ✅ Unlimited | ✅ One-time setup |
| Direct AWS Keys | ❌ Poor (keys stored) | ⚠️ Limited | ❌ Manual key rotation |
| AWS Organizations | ⚠️ Good | ⚠️ Single org only | ❌ Complex setup |
| CloudFormation StackSets | ✅ Good | ⚠️ Limited | ❌ Very complex |

---

## Summary

The IAM Integration uses AWS best practices for secure, cross-account access:

1. **User creates IAM role** in their account with trust policy
2. **FinSight backend assumes role** using STS with External ID
3. **Temporary credentials** are used to fetch Cost Explorer data
4. **Data is returned** to the user's dashboard
5. **Credentials expire** after 1 hour (no storage)

This architecture is secure, scalable, and follows AWS recommended patterns for third-party integrations.
