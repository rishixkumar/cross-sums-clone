from sqlmodel import SQLModel, Field
from typing import Optional
#--------------------------------------------------------
from datetime import datetime
#--------------------------------------------------------
import json
#--------------------------------------------------------



class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    name: Optional[str] = None
    color_scheme: Optional[str] = "default"
    games_played: int = 0
    games_won: int = 0
    games_lost: int = 0
    games_draw: int = 0
    games_score: int = 0
    color_scheme: Optional[str] = '{"background":"#e9f3fa","box":"#ffffff","text":"#2c3e50"}'
#--------------------------------------------------------

class PasswordResetToken(SQLModel, table=True):
    id: Optional[int] = Field(default = None, primary_key = True)
    email: str = Field(index = True)
    token: str = Field(index = True)
    expires_at: datetime
    used: bool = False
    created_at: datetime = Field(default_factory = datetime.utcnow)
#--------------------------------------------------------

