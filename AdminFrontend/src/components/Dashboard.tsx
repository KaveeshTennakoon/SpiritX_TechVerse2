import React, { useState } from 'react';
import { usePlayers } from '../context/PlayerContext';

// Mock data
const stats = {
  totalUsers: 2543,
  activeTeams: 1250,
  totalPlayers: 164,
  progress: 75,
};

const recentActivities = [
  {
    time: '2 hours ago',
    action: 'Updated player stats',
    admin: 'John Admin',
    details: 'Modified batting average for M. Singh',
  },
  {
    time: '5 hours ago',
    action: 'Added new player',
    admin: 'Sarah Admin',
    details: 'Added R. Patel to database',
  },
  {
    time: '1 day ago',
    action: 'Modified team',
    admin: 'Mike Admin',
    details: 'Updated Delhi Dragons lineup',
  },
];

interface PlayerFormData {
  name: string;
  university: string;
  category: 'Batsman' | 'Bowler' | 'All-rounder';
  runs?: number;
  ballsFaced?: number;
  innings?: number;
  wickets?: number;
  economy?: number;
  overs?: number;
}

function AddPlayerModal({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean; 
  onClose: () => void;
  onSubmit: (data: PlayerFormData) => void;
}) {
  const [formData, setFormData] = useState<PlayerFormData>({
    name: '',
    university: '',
    category: 'Batsman',
    runs: 0,
    ballsFaced: 0,
    innings: 0,
    wickets: 0,
    economy: 0,
    overs: 0,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      name: '',
      university: '',
      category: 'Batsman',
      runs: 0,
      ballsFaced: 0,
      innings: 0,
      wickets: 0,
      economy: 0,
      overs: 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Add New Player</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              University
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.category}
              onChange={(e) => setFormData({ 
                ...formData, 
                category: e.target.value as PlayerFormData['category']
              })}
            >
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All-rounder">All-rounder</option>
            </select>
          </div>

          {(formData.category === 'Batsman' || formData.category === 'All-rounder') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Runs
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.runs}
                  onChange={(e) => setFormData({ ...formData, runs: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Balls Faced
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.ballsFaced}
                  onChange={(e) => setFormData({ ...formData, ballsFaced: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Innings
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.innings}
                  onChange={(e) => setFormData({ ...formData, innings: parseInt(e.target.value) })}
                />
              </div>
            </>
          )}

          {(formData.category === 'Bowler' || formData.category === 'All-rounder') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wickets
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.wickets}
                  onChange={(e) => setFormData({ ...formData, wickets: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Economy
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.economy}
                  onChange={(e) => setFormData({ ...formData, economy: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overs
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.overs}
                  onChange={(e) => setFormData({ ...formData, overs: parseFloat(e.target.value) })}
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { players, addPlayer } = usePlayers();

  const handleAddPlayer = (playerData: PlayerFormData) => {
    // Calculate value based on stats
    const baseValue = 8000000; // Base value of ₹8,000,000
    const performanceBonus = (playerData.runs || 0) * 10000 + (playerData.wickets || 0) * 50000;
    const totalValue = baseValue + performanceBonus;
    const formattedValue = `₹ ${(totalValue / 100000).toFixed(1)},00,000`;

    // Create a new player object
    const newPlayer = {
      name: playerData.name,
      university: playerData.university,
      category: playerData.category,
      value: formattedValue,
      image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=100&h=100&fit=crop`,
    };

    // Add to the global players list
    addPlayer(newPlayer);

    // Add to recent activities
    const newActivity = {
      time: 'Just now',
      action: 'Added new player',
      admin: 'John Admin',
      details: `Added ${playerData.name} to database`,
    };
    recentActivities.unshift(newActivity);
    if (recentActivities.length > 3) {
      recentActivities.pop();
    }

    // Update stats
    stats.totalPlayers += 1;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, John</h1>
          <p className="text-gray-600">Here's what's happening with your tournament today.</p>
        </div>
        <div className="space-x-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            + Add Player
          </button>
        </div>
      </div>

      <AddPlayerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPlayer}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-gray-500 mb-2">Total Users</div>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <div className="text-green-500 text-sm">+12.5% from last week</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-gray-500 mb-2">Active Teams</div>
          <div className="text-2xl font-bold">{stats.activeTeams}</div>
          <div className="text-green-500 text-sm">+8.2% from last week</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-gray-500 mb-2">Total Players</div>
          <div className="text-2xl font-bold">{players.length}</div>
          <div className="text-gray-500 text-sm">+0% from last week</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-gray-500 mb-2">Tournament Progress</div>
          <div className="text-2xl font-bold">{stats.progress}%</div>
          <div className="text-green-500 text-sm">+5% from last week</div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Recent Activities</h2>
        <div className="divide-y">
          {recentActivities.map((activity, index) => (
            <div key={index} className="py-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">{activity.time}</div>
              <div>{activity.action}</div>
              <div>{activity.admin}</div>
              <div className="text-gray-600">{activity.details}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-2 gap-6">
        {players.slice(-2).map((player, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <img src={player.image} alt={player.name} className="w-12 h-12 rounded-full" />
              <div>
                <h3 className="font-bold">{player.name}</h3>
                <p className="text-gray-600">{player.university}</p>
              </div>
              <div className="ml-auto">
                <div className="text-blue-500">{player.category}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-gray-500">Value</div>
              <div className="font-bold">{player.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;