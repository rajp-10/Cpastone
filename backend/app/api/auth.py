from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token
from app.core.security import hash_password, verify_password
from app.core.jwt import create_access_token

from google.oauth2 import id_token
from google.auth.transport import requests
from pydantic import BaseModel
import os

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

class GoogleLoginRequest(BaseModel):
    credential: str

@router.post(
    "/register",
    response_model=UserResponse
)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
@router.post(
    "/login",
    response_model=Token
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={
            "sub": user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
    
@router.post("/google-login", response_model=Token)
def google_login(
    request: GoogleLoginRequest,
    db: Session = Depends(get_db)
):
    try:
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        if not client_id:
            raise RuntimeError("GOOGLE_CLIENT_ID is not set in backend environment")

        idinfo = id_token.verify_oauth2_token(
            request.credential,
            requests.Request(),
            client_id,
        )

        email = idinfo["email"]
        google_id = idinfo["sub"]
        username = idinfo.get("name", email.split("@")[0])

        user = db.query(User).filter(User.email == email).first()

        if not user:
            user = User(
                username=username,
                email=email,
                hashed_password="GOOGLE_LOGIN",
                google_id=google_id
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            if not user.google_id:
                user.google_id = google_id
                db.commit()

        access_token = create_access_token(
            data={"sub": user.email}
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    except Exception as e:
        # Avoid leaking full token/PII; log only the error string
        print("GOOGLE ERROR:", str(e))
        raise HTTPException(status_code=401, detail=str(e))

