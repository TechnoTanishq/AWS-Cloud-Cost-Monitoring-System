#models/aws_account.py
from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class AWSAccount(Base):
    __tablename__ = "aws_accounts"

    user_id = Column(Integer, ForeignKey("ClientData.id"), primary_key=True)
    account_id = Column(String, nullable=False)
    role_arn = Column(String, nullable=False)