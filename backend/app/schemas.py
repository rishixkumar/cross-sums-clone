from pydantic import BaseModel, EmailStr
from typing import Optional
#--------------------------------------------------------
from typing import Dict, Any
#--------------------------------------------------------


class UserCreate(BaseModel):
    email: EmailStr
    password: str
#--------------------------------------------------------

class UserRead(BaseModel):
    id: int
    email: EmailStr
    games_played: int
    games_won: int
    games_lost: int
    games_draw: int
    games_score: int

    class Config:
        from_attributes = True  # Use this for Pydantic v2+
#--------------------------------------------------------

class UserLogin(BaseModel):
    email: EmailStr
    password: str
#--------------------------------------------------------

class PasswordReset(BaseModel):
    email: EmailStr
    reset_code: str
    new_password: str
#--------------------------------------------------------

class UserSettings(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    color_scheme: Optional[Dict[str, Any]] = None
#--------------------------------------------------------

class UserSettingsUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    color_scheme: Optional[Dict[str, Any]] = None
#--------------------------------------------------------

class ChangePassword(BaseModel):
    old_password: str
    new_password: str
    confirm_password: str
#--------------------------------------------------------
