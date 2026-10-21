from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    title = Column(String(150), nullable=False)

    destination = Column(String(150), nullable=False)

    budget = Column(Integer, nullable=False)

    travelers = Column(Integer, nullable=False)

    start_date = Column(String(30), nullable=False)

    end_date = Column(String(30), nullable=False)

    itinerary = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship("User")