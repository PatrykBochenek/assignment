'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function CricketAnalytics() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('http://localhost:8000/games');
      const data = await response.json();
      setGames(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching games:', error);
      setLoading(false);
    }
  };

  const fetchSimulations = async (gameId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/game/${gameId}/simulations`);
      const data = await response.json();
      setSimulationData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching simulations:', error);
      setLoading(false);
    }
  };

  const handleGameSelect = (e) => {
    const game = games[e.target.value];
    setSelectedGame(game);
    fetchSimulations(game.id);
  };

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Match Analysis</h1>
          <p className="text-gray-500">Select a match to view detailed predictions and statistics</p>
        </div>

        {/* Game Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <label htmlFor="game-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Match
          </label>
          <select
            id="game-select"
            className="w-full md:w-[400px] rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            onChange={handleGameSelect}
            defaultValue=""
          >
            <option value="" disabled>Choose a match to analyze...</option>
            {games.map((game, index) => (
              <option key={game.id} value={index}>
                {game.home_team} vs {game.away_team} ({new Date(game.date).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && selectedGame && simulationData && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Match Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Match Statistics</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Teams</h3>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-blue-600">{selectedGame.home_team}</span>
                    <span className="text-gray-400">vs</span>
                    <span className="font-medium text-green-600">{selectedGame.away_team}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Win Probability</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 mb-1">Home Team</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {simulationData.home_team_win_percentage.toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">Away Team</p>
                      <p className="text-2xl font-bold text-green-600">
                        {(100 - simulationData.home_team_win_percentage).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Score Distribution</h2>
              <div className="h-[300px]">
                <BarChart 
                  width={400} 
                  height={300} 
                  data={prepareHistogramData()} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="bin" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="home" fill="#3b82f6" name={selectedGame.home_team} />
                  <Bar dataKey="away" fill="#22c55e" name={selectedGame.away_team} />
                </BarChart>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}