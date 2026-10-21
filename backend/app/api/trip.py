from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.services.gemini_service import generate_itinerary
from app.database.database import get_db
from app.models.trip import Trip
from app.models.user import User
from app.core.dependencies import get_current_user
from app.schemas.trip import TripCreate, TripResponse

router = APIRouter(
    prefix="/trips",
    tags=["Trips"]
)


@router.post(
    "/",
    response_model=TripResponse
)
def create_trip(
    trip: TripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ai_itinerary = generate_itinerary(
    destination=trip.destination,
    budget=trip.budget,
    travelers=trip.travelers,
    start_date=trip.start_date,
    end_date=trip.end_date
)
    new_trip = Trip(
        user_id=current_user.id,
        title=trip.title,
        destination=trip.destination,
        budget=trip.budget,
        travelers=trip.travelers,
        start_date=trip.start_date,
        end_date=trip.end_date,
        itinerary=ai_itinerary
    )

    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)

    return new_trip


@router.get(
    "/",
    response_model=list[TripResponse]
)
def get_trips(
    db: Session = Depends(get_db)
):

    trips = db.query(Trip).all()

    return trips