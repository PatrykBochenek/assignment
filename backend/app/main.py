from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pandas as pd
from .database import engine, get_db, SessionLocal
from . import models, schemas, routes

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Include routes
app.include_router(routes.router)

# Startup event to load CSV data
@app.on_event("startup")
async def load_initial_data():
    db = SessionLocal()
    try:
        # Check if data already exists
        if db.query(models.Venue).count() == 0:
            print("Loading initial data...")
            
            # Step 1: Load venues first
            venues_df = pd.read_csv("data/venues.csv")
            # Ensure venue_id starts from 1 if it doesn't already
            venues_df['venue_id'] = venues_df['venue_id'].astype(int)
            
            # Create all venues first
            for _, row in venues_df.iterrows():
                venue = models.Venue(
                    venue_id=row['venue_id'],
                    venue_name=row['venue_name']
                )
                db.add(venue)
            
            # Commit venues to ensure they exist before adding games
            db.commit()
            print(f"Loaded {len(venues_df)} venues")
            
            # Step 2: Load games
            games_df = pd.read_csv("data/games.csv")
            # Ensure venue_id is int type
            games_df['venue_id'] = games_df['venue_id'].astype(int)
            
            # Verify all venue_ids exist before inserting
            existing_venue_ids = set([v[0] for v in db.query(models.Venue.venue_id).all()])
            
            for _, row in games_df.iterrows():
                if row['venue_id'] in existing_venue_ids:
                    game = models.Game(
                        home_team=row['home_team'],
                        away_team=row['away_team'],
                        date=pd.to_datetime(row['date']).date(),
                        venue_id=row['venue_id']
                    )
                    db.add(game)
                else:
                    print(f"Warning: Venue ID {row['venue_id']} not found for game {row['home_team']} vs {row['away_team']}")
            
            # Commit games
            db.commit()
            print(f"Loaded {len(games_df)} games")
            
            # Step 3: Load simulations
            sims_df = pd.read_csv("data/simulations.csv")
            for _, row in sims_df.iterrows():
                simulation = models.Simulation(
                    team_id=row['team_id'],
                    team=row['team'],
                    simulation_run=row['simulation_run'],
                    results=row['results']
                )
                db.add(simulation)
            
            # Final commit for simulations
            db.commit()
            print(f"Loaded {len(sims_df)} simulations")
            
            print("Initial data load complete")
    except Exception as e:
        print(f"Error loading data: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)