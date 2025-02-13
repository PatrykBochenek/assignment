from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from . import models, schemas
from .database import get_db

router = APIRouter()

@router.get("/games", response_model=List[schemas.Game])
def get_games(db: Session = Depends(get_db)):
    return db.query(models.Game).all()

@router.get("/game/{game_id}/simulations")
def get_game_simulations(game_id: int, db: Session = Depends(get_db)):
    game = db.query(models.Game).filter(models.Game.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    # Get simulations for both teams
    home_sims = db.query(models.Simulation)\
        .filter(models.Simulation.team == game.home_team)\
        .all()
    away_sims = db.query(models.Simulation)\
        .filter(models.Simulation.team == game.away_team)\
        .all()
    
    # Calculate win percentage for home team
    total_simulations = len(home_sims)
    home_wins = sum(1 for h, a in zip(home_sims, away_sims) if h.results > a.results)
    win_percentage = (home_wins / total_simulations) * 100 if total_simulations > 0 else 0
    
    return {
        "home_team_simulations": [s.results for s in home_sims],
        "away_team_simulations": [s.results for s in away_sims],
        "home_team_win_percentage": win_percentage
    }