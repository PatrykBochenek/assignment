# schemas.py
from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class VenueBase(BaseModel):
    venue_name: str

class VenueCreate(VenueBase):
    venue_id: int

class Venue(VenueBase):
    venue_id: int
    
    class Config:
        from_attributes = True

class GameBase(BaseModel):
    home_team: str
    away_team: str
    date: date
    venue_id: int

class GameCreate(GameBase):
    pass

class Game(GameBase):
    id: int
    venue: Optional[Venue] = None

    class Config:
        from_attributes = True

class SimulationBase(BaseModel):
    team_id: str
    team: str
    simulation_run: int
    results: float

class SimulationCreate(SimulationBase):
    pass

class Simulation(SimulationBase):
    id: int

    class Config:
        from_attributes = True

class SimulationResponse(BaseModel):
    home_team_simulations: List[float]
    away_team_simulations: List[float]
    home_team_win_percentage: float