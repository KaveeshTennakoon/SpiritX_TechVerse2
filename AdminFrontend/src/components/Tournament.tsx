import React from 'react';

const teams = [
  {
    name: 'Oxford United',
    matches: 8,
    wins: 6,
    losses: 2,
    points: 12,
    nrr: 0.953,
  },
  {
    name: 'Cambridge Knights',
    matches: 8,
    wins: 6,
    losses: 2,
    points: 12,
    nrr: 0.856,
  },
  {
    name: 'LSE Strikers',
    matches: 8,
    wins: 5,
    losses: 3,
    points: 10,
    nrr: 0.345,
  },
  {
    name: 'UCL Warriors',
    matches: 8,
    wins: 4,
    losses: 4,
    points: 8,
    nrr: 0.123,
  },
];

const topPlayers = [
  {
    name: 'John Smith',
    university: 'Oxford',
    runs: 425,
    average: 53.12,
    strikeRate: 142.8,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  },
  {
    name: 'James Anderson',
    university: 'Manchester',
    wickets: 24,
    economy: 6.8,
    average: 18.5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  },
];

function Tournament() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Tournament Summary</h1>
        <div className="space-x-4">
          
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Tournament Stats
          </button>
        </div>
      </div>

      {/* Tournament Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-gray-500 mb-2">Total Matches</div>
          <div className="text-2xl font-bold">64</div>
          <div className="text-blue-500 text-sm">80% completed</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-gray-500 mb-2">Total Runs</div>
          <div className="text-2xl font-bold">12,458</div>
          <div className="text-green-500 text-sm">+8.2% vs last month</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-gray-500 mb-2">Total Wickets</div>
          <div className="text-2xl font-bold">386</div>
          <div className="text-green-500 text-sm">+12.5% vs last month</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-gray-500 mb-2">Active Players</div>
          <div className="text-2xl font-bold">220</div>
          <div className="text-green-500 text-sm">+5.3% vs last month</div>
        </div>
      </div>

      {/* Points Table */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Points Table</h2>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                M
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                W
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                L
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pts
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NRR
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {teams.map((team, index) => (
              <tr key={index} className={index === 0 ? 'bg-blue-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{team.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {team.matches}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  {team.wins}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  {team.losses}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {team.points}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {team.nrr.toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-2 gap-6">
        {topPlayers.map((player, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4 mb-4">
              <img src={player.image} alt="" className="h-12 w-12 rounded-full" />
              <div>
                <div className="font-bold text-lg">{player.name}</div>
                <div className="text-gray-500">{player.university}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {player.runs ? (
                <>
                  <div>
                    <div className="text-gray-500 text-sm">Runs</div>
                    <div className="font-bold">{player.runs}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Average</div>
                    <div className="font-bold">{player.average}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Strike Rate</div>
                    <div className="font-bold">{player.strikeRate}</div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="text-gray-500 text-sm">Wickets</div>
                    <div className="font-bold">{player.wickets}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Economy</div>
                    <div className="font-bold">{player.economy}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Average</div>
                    <div className="font-bold">{player.average}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tournament;