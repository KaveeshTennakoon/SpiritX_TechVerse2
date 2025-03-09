import React from 'react';
import { CircleDollarSign, TrendingUp, AlertTriangle, Trophy } from 'lucide-react';
import { Player } from '../data/players';

interface BudgetTrackerProps {
  totalBudget: number;
  selectedPlayers: Player[];
  onRemovePlayer: (id: number) => void;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ 
  totalBudget, 
  selectedPlayers,
  onRemovePlayer
}) => {
  const calculateSpentByRole = () => {
    const spent = {
      batsmen: { amount: 0, players: 0 },
      bowlers: { amount: 0, players: 0 },
      allrounders: { amount: 0, players: 0 }
    };

    selectedPlayers.forEach(player => {
      switch (player.role) {
        case 'Batsman':
          spent.batsmen.amount += player.price;
          spent.batsmen.players += 1;
          break;
        case 'Bowler':
          spent.bowlers.amount += player.price;
          spent.bowlers.players += 1;
          break;
        case 'All-rounder':
          spent.allrounders.amount += player.price;
          spent.allrounders.players += 1;
          break;
      }
    });

    return spent;
  };

  const spentByRole = calculateSpentByRole();
  const totalSpent = selectedPlayers.reduce((sum, player) => sum + player.price, 0);
  const remainingBudget = totalBudget - totalSpent;
  const usedPercentage = (totalSpent / totalBudget) * 100;

  const getBudgetHealthStatus = () => {
    if (usedPercentage > 90) return { status: 'Critical', color: 'text-red-600' };
    if (usedPercentage > 75) return { status: 'Warning', color: 'text-yellow-600' };
    return { status: 'Healthy', color: 'text-green-600' };
  };

  const budgetHealth = getBudgetHealthStatus();

  const getRecommendations = () => {
    const recommendations = [];
    const avgCostPerPlayer = totalSpent / (selectedPlayers.length || 1);

    if (spentByRole.batsmen.players < 2) {
      recommendations.push('Consider adding more batsmen to balance your team');
    }
    if (spentByRole.bowlers.players < 2) {
      recommendations.push('Your team might need more bowlers');
    }
    if (avgCostPerPlayer > (totalBudget / 11) * 1.5) {
      recommendations.push('Try to distribute budget more evenly across players');
    }
    if (remainingBudget < totalBudget * 0.2) {
      recommendations.push('Consider keeping some budget reserve for future trades');
    }

    return recommendations;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Total Budget</h2>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-3xl font-bold">₹ {totalBudget.toLocaleString()}</span>
              <span className={`${remainingBudget > 0 ? 'text-green-600' : 'text-red-600'}`}>
                Remaining: ₹ {remainingBudget.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={usedPercentage > 90 ? '#EF4444' : usedPercentage > 75 ? '#F59E0B' : '#3B82F6'}
                strokeWidth="3"
                strokeDasharray={`${usedPercentage}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-lg font-bold">{Math.round(usedPercentage)}%</span>
              <span className="text-xs">Used</span>
            </div>
            <span className={`absolute bottom-0 right-0 ${budgetHealth.color} bg-white text-xs px-2 py-1 rounded-full shadow-sm border`}>
              {budgetHealth.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {Object.entries(spentByRole).map(([category, data]) => (
            <div key={category} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold capitalize mb-2">{category}</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">{data.players} Players</span>
                <span className="font-semibold">₹ {data.amount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(data.amount / totalBudget) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {Math.round((data.amount / totalBudget) * 100)}% of total budget
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Team Players</h3>
        {selectedPlayers.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy size={32} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Players Selected</h3>
            <p className="text-gray-600">
              Start building your team by adding players from the market!
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-3">Player Name</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">University</th>
                <th className="pb-3">Cost</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedPlayers.map((player) => (
                <tr key={player.id} className="border-b">
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                     
                      <span>{player.name}</span>
                    </div>
                  </td>
                  <td className="py-3">{player.role}</td>
                  <td className="py-3">{player.university}</td>
                  <td className="py-3">₹ {player.price.toLocaleString()}</td>
                  <td className="py-3">
                    <button 
                      onClick={() => onRemovePlayer(player.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <AlertTriangle size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Highest Investments</h3>
          <div className="space-y-4">
            {selectedPlayers
              .sort((a, b) => b.price - a.price)
              .slice(0, 3)
              .map((player, index) => (
                <div key={player.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{player.name}</p>
                      <p className="text-sm text-gray-500">{player.role}</p>
                    </div>
                  </div>
                  <span className="font-semibold">₹ {player.price.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Budget Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Avg. Cost/Player</span>
                <span className="font-semibold">
                  ₹ {selectedPlayers.length 
                    ? Math.round(totalSpent / selectedPlayers.length).toLocaleString() 
                    : '0'}
                </span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Budget Efficiency</span>
                <span className={`font-semibold ${budgetHealth.color}`}>
                  {Math.round((totalSpent / totalBudget) * 100)}%
                </span>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                {getRecommendations().map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;