from fastapi import FastAPI
from app.api import router
from app.database import engine
from app import models

app = FastAPI()
app.include_router(router)

def create_db_and_tables():
    models.SQLModel.metadata.create_all(engine)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.on_event("shutdown")
def on_shutdown():
    engine.dispose()