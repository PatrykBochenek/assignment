from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from .database import Base

class Venue(Base):
    __tablename__ = "venues"
    
    venue_id = Column(Integer, primary_key=True, autoincrement=False)
    venue_name = Column(String(255))
    games = relationship("Game", back_populates="venue")

class Game(Base):
    __tablename__ = "games"
    
    id = Column(Integer, primary_key=True)
    home_team = Column(String(255))
    away_team = Column(String(255))  
    date = Column(Date)
    venue_id = Column(Integer, ForeignKey("venues.venue_id"))
    venue = relationship("Venue", back_populates="games")

class Simulation(Base):
    __tablename__ = "simulations"
    
    id = Column(Integer, primary_key=True)
    team_id = Column(String(100))
    team = Column(String(255))
    simulation_run = Column(Integer)
    results = Column(Float)