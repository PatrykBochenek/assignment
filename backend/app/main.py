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
async def refresh_and_load_data():
    db = SessionLocal()
    try:
        print("Refreshing database: Clearing existing data...")

        # Clear all existing data
        db.query(models.Simulation).delete()
        db.query(models.Game).delete()
        db.query(models.Venue).delete()
        db.commit()
        print("Existing data cleared.")

        print("Loading initial data...")

        # Load Venues
        venues_df = pd.read_csv("data/venues.csv")
        venues_df['venue_id'] = venues_df['venue_id'].astype(int)

        for _, row in venues_df.iterrows():
            venue = models.Venue(
                venue_id=row['venue_id'],
                venue_name=row['venue_name']
            )
            db.add(venue)
        db.commit()
        print(f"Loaded {len(venues_df)} venues.")

        # Load Games
        games_df = pd.read_csv("data/games.csv")
        games_df['venue_id'] = games_df['venue_id'].astype(int)

        for _, row in games_df.iterrows():
            game = models.Game(
                home_team=row['home_team'],
                away_team=row['away_team'],
                date=pd.to_datetime(row['date']).date(),
                venue_id=row['venue_id']
            )
            db.add(game)
        db.commit()
        print(f"Loaded {len(games_df)} games.")

        # Load Simulations
        sims_df = pd.read_csv("data/simulations.csv")

        for _, row in sims_df.iterrows():
            simulation = models.Simulation(
                team_id=row['team_id'],
                team=row['team'],
                simulation_run=row['simulation_run'],
                results=row['results']
            )
            db.add(simulation)
        db.commit()
        print(f"Loaded {len(sims_df)} simulations.")

        print("Database refresh and initial data load complete.")

    except Exception as e:
        print(f"Error during data load: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)