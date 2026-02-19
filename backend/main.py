from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel #Structure syntax
from typing import List
from database import session,engine
import db_models
import models
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from security import hash_password,verify_password, create_access_token

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Creating table in the DB
db_models.Base.metadata.create_all(bind=engine)   #note that metadata is imp to write


def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

#Default
@app.get("/")
def read_root():
    return{"message" : "Welcome to FinSight"}

#Fething all data
@app.get("/clients")
def get_clients(db:Session = Depends(get_db)):
    db_clients = db.query(db_models.Client).all()
    return db_clients

# #Fetching Data by id
# @app.get("/login/{email}&{password}")
# def get_client(email: str, password: str, db:Session = Depends(get_db)):
#     db_client = db.query(db_models.Client).filter(db_models.Client.email == email and db_models.Client.password == password).first()
#     if db_client:
#         return db_client
#     return "Client Not Found"

#Adding Data
@app.post("/register")
def register(clientData : models.Client, db: Session = Depends(get_db)):

    existing = db.query(db_models.Client).filter(db_models.Client.email == clientData.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(clientData.password)

    new_user = db_models.Client(
        name=clientData.name,
        email=clientData.email,
        password=hashed_password,
        organization=clientData.organization
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}

from security import verify_password, create_access_token

@app.post("/login")
def login(clientData : models.ClientLogin, db: Session = Depends(get_db)):

    db_user = db.query(db_models.Client).filter(db_models.Client.email == clientData.email).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(clientData.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    access_token = create_access_token(
        data={"sub": str(db_user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "organization": db_user.organization
        }
    }

#Updating Data
@app.put("/update/{id}")
def update_client(id : int, updateClient:models.Client, db:Session = Depends(get_db)):
    db_client = db.query(db_models.Client).filter(db_models.Client.id == id).first()
    if db_client:
        db_client.name = updateClient.name
        db_client.email = updateClient.email
        db_client.password = updateClient.password
        db_client.organization = updateClient.organization
        db.add(db_client)
        db.commit()
        return updateClient
    return "Client Not Found"

#Deleting Data
@app.delete("/delete/{id}")
def delete_temp(id: int, db:Session = Depends(get_db)):
    db_client = db.query(db_models.Client).filter(db_models.Client.id == id).first()
    if db_client:
        db.delete(db_client)
        db.commit()
        return {"Message": "Client Deleted Successfully"}
    return{"error": "Client not found"}