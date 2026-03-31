#models/models.py
from pydantic import BaseModel, EmailStr

class Client(BaseModel):
    name: str
    email : EmailStr
    password: str
    organization : str

class ClientLogin(BaseModel):
    email : EmailStr
    password: str

    class Config:
        from_attributes = True


class ForgotPassword(BaseModel):
    email: EmailStr


class ResetPassword(BaseModel):
    token: str
    new_password: str