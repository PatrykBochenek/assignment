from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from .database import Base

class Venue(Base):
    __tablename__ = "venues"
    
    venue_id = Column(Integer, primary_key=True)
    venue_name = Column(String(255))  # Added length specification
    games = relationship("Game", back_populates="venue")

class Game(Base):
    __tablename__ = "games"
    
    id = Column(Integer, primary_key=True)
    home_team = Column(String(255))  # Added length specification
    away_team = Column(String(255))  # Added length specification
    date = Column(Date)
    venue_id = Column(Integer, ForeignKey("venues.venue_id"))
    venue = relationship("Venue", back_populates="games")

class Simulation(Base):
    __tablename__ = "simulations"
    
    id = Column(Integer, primary_key=True)
    team_id = Column(String(100))  # Added length specification
    team = Column(String(255))     # Added length specification
    simulation_run = Column(Integer)
    results = Column(Float)