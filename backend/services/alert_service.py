from redis_client_cnf import redis_client

def should_send_alert(user_id, account_id):
    key = f"budget_alert:{user_id}:{account_id}"

    # check if alert already sent
    if redis_client.get(key):
        return False

    # set flag with expiry (24 hours)
    redis_client.setex(key, 86400, "sent")
    return True