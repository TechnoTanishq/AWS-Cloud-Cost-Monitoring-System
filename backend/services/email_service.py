import smtplib
from email.mime.text import MIMEText
import os

SMTP_EMAIL = os.getenv("SMTP_EMAIL")  # your gmail
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")  # app password

def send_budget_email(to_email, cost, budget, utilization, account_id):
    subject = "⚠️ AWS Budget Alert"

    body = f"""
AWS Budget Alert 🚨

Your AWS spending has exceeded the defined threshold.

AWS Account ID: {account_id}
Current Cost: ${cost}
Budget: ${budget}
Utilization: {utilization:.2f}%

Please take action to control your usage.
"""

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.send_message(msg)