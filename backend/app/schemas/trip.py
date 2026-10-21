from pydantic import BaseModel, ConfigDict
from datetime import datetime


class TripCreate(BaseModel):
    title: str
    destination: str
    budget: int
    travelers: int
    start_date: str
    end_date: str
    itinerary: str


class TripResponse(BaseModel):
    id: int
    title: str
    destination: str
    budget: int
    travelers: int
    start_date: str
    end_date: str
    itinerary: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)