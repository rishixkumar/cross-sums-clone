from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

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

class UserLogin(BaseModel):
    email: EmailStr
    password: str