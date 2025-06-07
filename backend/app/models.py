from sqlmodel import SQLModel, Field
from typing import Optional

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    games_played: int = 0
    games_won: int = 0
    games_lost: int = 0
    games_draw: int = 0
    games_score: int = 0
