from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.models import User, Trip
from app.api.auth import router as auth_router
from app.api.trip import router as trip_router

app = FastAPI(
    title="Smart AI Travel Planner API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(trip_router)


@app.get("/")
def root():
    return {
        "message": "Database Connected Successfully 🚀"
    }