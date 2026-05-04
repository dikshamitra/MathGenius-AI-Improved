from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from database import SessionLocal
from models import User

router = APIRouter()

# -------------------- DB Dependency --------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------- REQUEST MODELS --------------------
class UserCreateRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

# -------------------- REGISTER --------------------
@router.post("/register")
def register_user(request: UserCreateRequest, db: Session = Depends(get_db)):
    
    # Check if email exists
    existing_email = db.query(User).filter(User.email == request.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check if username exists
    existing_username = db.query(User).filter(User.username == request.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    # Create new user
    new_user = User(
        username=request.username,
        email=request.email,
        password=request.password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id,
        "username": new_user.username,
        "email": new_user.email
    }

# -------------------- LOGIN --------------------
@router.post("/login")
def login_user(request: UserLoginRequest, db: Session = Depends(get_db)):
    
    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.password != request.password:
        raise HTTPException(status_code=401, detail="Invalid password")

    return {
        "message": "Login successful",
        "user_id": user.id,
        "username": user.username,
        "email": user.email
    }

# -------------------- GET ALL USERS (optional for testing) --------------------
@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users