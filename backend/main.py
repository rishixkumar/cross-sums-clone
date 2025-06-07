from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router
from app.database import engine
from app import models
#--------------------------------------------------------

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
#--------------------------------------------------------
def create_db_and_tables():
    models.SQLModel.metadata.create_all(engine)
#--------------------------------------------------------

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
#--------------------------------------------------------

@app.on_event("shutdown")
def on_shutdown():
    engine.dispose()
