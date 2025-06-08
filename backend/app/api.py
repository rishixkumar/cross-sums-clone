from fastapi import APIRouter
#--------------------------------------------------------
from fastapi import Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.models import User, PasswordResetToken
from app.schemas import UserCreate, UserRead, UserLogin, PasswordReset
from app.auth import hash_password, verify_password, create_access_token, get_current_user
#--------------------------------------------------------
from datetime import timedelta, datetime
#--------------------------------------------------------
from fastapi.security import OAuth2PasswordRequestForm
#--------------------------------------------------------
import random
import json
from app.email_utils import send_reset_email
#--------------------------------------------------------
from app.schemas import UserSettings, UserSettingsUpdate, ChangePassword
#--------------------------------------------------------


router = APIRouter()
#--------------------------------------------------------
reset_tokens = {}
#--------------------------------------------------------


@router.get("/")
async def root():
    return {"message": "Backend is running"}
#--------------------------------------------------------

@router.post("/signup", response_model=UserRead)
def signup(user: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.email == user.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = User(email=user.email, hashed_password=hash_password(user.password))
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user
#--------------------------------------------------------

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    db_user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
#--------------------------------------------------------

@router.get("/profile", response_model=UserRead)
def read_profile(current_user: User = Depends(get_current_user)):
    return current_user
#--------------------------------------------------------

@router.post("/forgot-password")
def forgot_password(email: str, session: Session = Depends(get_session)):
    print(f"DEBUG: forgot-password endpoint called with email: {email}")
    # Check if user exists
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        # Don't reveal if email exists for security
        return {"msg": "If the email exists, a reset code has been sent."}
    
    # Invalidate any existing unused tokens for this email
    existing_tokens = session.exec(
        select(PasswordResetToken).where(
            PasswordResetToken.email == email,
            PasswordResetToken.used == False,
            PasswordResetToken.expires_at > datetime.utcnow()
        )
    ).all()
    
    for token in existing_tokens:
        token.used = True
    
    # Generate new 6-digit code
    code = str(random.randint(100000, 999999))
    expires_at = datetime.utcnow() + timedelta(minutes=15)  # 15-minute expiry
    
    # Store in database
    reset_token = PasswordResetToken(
        email=email,
        token=code,
        expires_at=expires_at
    )
    session.add(reset_token)
    session.commit()
    
    # Send email
    print(f"DEBUG: About to send email to {email}")  # ADD THIS LINE
    send_reset_email(email, code)
    print(f"DEBUG: Email sending completed")

    return {"msg": "Reset code sent to your email."}
#--------------------------------------------------------

@router.post("/reset-password")
def reset_password(reset_data: PasswordReset, session: Session = Depends(get_session)):
    reset_token = session.exec(
        select(PasswordResetToken).where(
            PasswordResetToken.email == reset_data.email,
            PasswordResetToken.token == reset_data.reset_code,
            PasswordResetToken.used == False,
            PasswordResetToken.expires_at > datetime.utcnow()
        )
    ).first()
    
    if not reset_token:
        raise HTTPException(status_code=400, detail="Invalid or expired reset code")
    
    user = session.exec(select(User).where(User.email == reset_data.email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.hashed_password = hash_password(reset_data.new_password)
    
    reset_token.used = True
    
    session.commit()
    return {"msg": "Password updated successfully"}
#--------------------------------------------------------

@router.delete("/cleanup-expired-tokens")
def cleanup_expired_tokens(session: Session = Depends(get_session)):
    """Remove expired reset tokens (maintenance endpoint)"""
    expired_tokens = session.exec(
        select(PasswordResetToken).where(
            PasswordResetToken.expires_at < datetime.utcnow()
        )
    ).all()
    
    for token in expired_tokens:
        session.delete(token)
    
    session.commit()
    return {"msg": f"Cleaned up {len(expired_tokens)} expired tokens"}
#--------------------------------------------------------

@router.get("/debug-users")
def debug_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return {"users": [{"id": u.id, "email": u.email} for u in users]}
#--------------------------------------------------------

@router.get("/settings", response_model=UserSettings)
def get_settings(current_user: User = Depends(get_current_user)):
    """Get user settings and preferences"""
    color_scheme = current_user.color_scheme
    if color_scheme and isinstance(color_scheme, str):
        try:
            color_scheme = json.loads(color_scheme)
        except Exception:
            color_scheme = {"background": "#e9f3fa", "box": "#ffffff", "text": "#2c3e50"}
    return UserSettings(
        name=current_user.name,
        email=current_user.email,
        color_scheme=color_scheme
    )
#--------------------------------------------------------

@router.put("/settings", response_model=UserSettings)
def update_settings(
    settings_update: UserSettingsUpdate, 
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update user settings and preferences"""
    if settings_update.email and settings_update.email != current_user.email:
        existing_user = session.exec(
            select(User).where(User.email == settings_update.email)
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    update_data = settings_update.model_dump(exclude_unset=True)
    if 'color_scheme' in update_data and isinstance(update_data['color_scheme'], dict):
        update_data['color_scheme'] = json.dumps(update_data['color_scheme'])
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    session.commit()
    session.refresh(current_user)
    
    # Parse color_scheme for response
    color_scheme = current_user.color_scheme
    if color_scheme and isinstance(color_scheme, str):
        try:
            color_scheme = json.loads(color_scheme)
        except Exception:
            color_scheme = {"background": "#e9f3fa", "box": "#ffffff", "text": "#2c3e50"}
    
    return UserSettings(
        name=current_user.name,
        email=current_user.email,
        color_scheme=color_scheme
    )
#--------------------------------------------------------

@router.post("/change-password")
def change_password(
    password_data: ChangePassword,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Change user password with old password verification"""
    if not verify_password(password_data.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    if len(password_data.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    
    if password_data.new_password != password_data.confirm_password:
        raise HTTPException(status_code=400, detail="New passwords do not match")
    
    current_user.hashed_password = hash_password(password_data.new_password)
    session.commit()
    
    return {"msg": "Password updated successfully"}
#--------------------------------------------------------