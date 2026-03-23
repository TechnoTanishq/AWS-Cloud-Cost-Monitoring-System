from datetime import datetime, timedelta
import boto3

def get_aws_cost():
    ce = boto3.client("ce", region_name="us-east-1")

    today = datetime.utcnow()

    start = today.replace(day=1).strftime("%Y-%m-%d")
    end = (today + timedelta(days=1)).strftime("%Y-%m-%d")

    response = ce.get_cost_and_usage(
        TimePeriod={
            'Start': start,
            'End': end
        },
        Granularity='DAILY',
        Metrics=['UnblendedCost']
    )

    total = 0

    for day in response.get('ResultsByTime', []):
        amount = day['Total']['UnblendedCost']['Amount']
        total += float(amount)

    # ✅ fallback: if still zero, try monthly directly
    if total == 0:
        response = ce.get_cost_and_usage(
            TimePeriod={
                'Start': start,
                'End': end
            },
            Granularity='MONTHLY',
            Metrics=['UnblendedCost']
        )

        total = float(response['ResultsByTime'][0]['Total']['UnblendedCost']['Amount'])

    return round(max(0, total), 2)
   # return 10