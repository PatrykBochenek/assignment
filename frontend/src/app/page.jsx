'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function CricketAnalytics() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [simulationData, setSimulationData] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('http://localhost:8000/games');
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchSimulations = async (gameId) => {
    try {
      const response = await fetch(`http://localhost:8000/game/${gameId}/simulations`);
      const data = await response.json();
      setSimulationData(data);
    } catch (error) {
      console.error('Error fetching simulations:', error);
    }
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    fetchSimulations(game.id);
  };

  // Prepare histogram data
  const prepareHistogramData = () => {
    if (!simulationData) return [];
    
    const bins = 10;
    const homeData = simulationData.home_team_simulations;
    const awayData = simulationData.away_team_simulations;
    
    const minScore = Math.min(...homeData, ...awayData);
    const maxScore = Math.max(...homeData, ...awayData);
    const binSize = (maxScore - minScore) / bins;
    
    return Array.from({ length: bins }, (_, i) => {
      const binStart = minScore + (i * binSize);
      const binEnd = binStart + binSize;
      
      return {
        bin: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
        home: homeData.filter(score => score >= binStart && score < binEnd).length,
        away: awayData.filter(score => score >= binStart && score < binEnd).length,
      };
    });
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Cricket Match Analytics</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select a Game</h2>
        <select 
          className="p-2 border rounded"
          onChange={(e) => handleGameSelect(games[e.target.value])}
        >
          <option value="">Select a game...</option>
          {games.map((game, index) => (
            <option key={game.id} value={index}>
              {game.home_team} vs {game.away_team} ({new Date(game.date).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      {selectedGame && simulationData && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Match Details</h2>
            <p className="text-lg">
              {selectedGame.home_team} vs {selectedGame.away_team}
            </p>
            <p className="text-lg font-bold text-blue-600">
              Home Team Win Percentage: {simulationData.home_team_win_percentage.toFixed(1)}%
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Simulation Results Distribution</h2>
            <div className="w-full h-96">
              <BarChart width={800} height={400} data={prepareHistogramData()}>
                <XAxis dataKey="bin" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="home" fill="#8884d8" name={selectedGame.home_team} />
                <Bar dataKey="away" fill="#82ca9d" name={selectedGame.away_team} />
              </BarChart>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}