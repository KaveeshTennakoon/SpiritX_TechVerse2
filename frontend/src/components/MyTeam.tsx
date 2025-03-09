import React from 'react';
import { Trophy, Trash2, Award, Target, Activity, TrendingUp, Star, Users, DollarSign, Percent } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  university: string;
  role: string;
  
  price: number;
  stats: {
    battingAvg: number;
    strikeRate: number;
    matches: number;
    [key: string]: any;
  };
}

interface TeamLimits {
  [key: string]: { current: number; max: number };
}

interface MyTeamProps {
  players: Player[];
  onRemovePlayer: (id: number) => void;
  teamLimits: TeamLimits;
  totalBudget: number;
  remainingBudget: number;
}

const MyTeam: React.FC<MyTeamProps> = ({ 
  players, 
  onRemovePlayer, 
  teamLimits, 
  totalBudget,
  remainingBudget 
}) => {
  const totalPlayers = players.length;
  const budgetUsedPercentage = ((totalBudget - remainingBudget) / totalBudget) * 100;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Batsman':
        return <Award className="w-3.5 h-3.5" />;
      case 'Bowler':
        return <Target className="w-3.5 h-3.5" />;
      case 'All-rounder':
        return <Activity className="w-3.5 h-3.5" />;
      default:
        return <Trophy className="w-3.5 h-3.5" />;
    }
  };

  const getPerformanceIndicator = (stats: Player['stats']) => {
    const avgScore = (stats.battingAvg / 50) * 100;
    if (avgScore >= 80) return { color: 'text-green-600', icon: <TrendingUp size={14} />, label: 'Exceptional' };
    if (avgScore >= 60) return { color: 'text-blue-600', icon: <Star size={14} />, label: 'Outstanding' };
    return { color: 'text-yellow-600', icon: <Trophy size={14} />, label: 'Good' };
  };

  const overviewCards = [
    {
      title: 'Squad Size',
      value: `${totalPlayers}/11`,
      icon: <Users className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      progress: (totalPlayers / 11) * 100
    },
    {
      title: 'Budget Used',
      value: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(totalBudget - remainingBudget),
      icon: <DollarSign className="w-5 h-5" />,
      color: 'from-emerald-500 to-emerald-600',
      progress: budgetUsedPercentage
    },
    {
      title: 'Team Balance',
      value: `${Object.values(teamLimits).reduce((acc, { current, max }) => 
        acc + (current / max) * 100, 0) / Object.keys(teamLimits).length}%`,
      icon: <Percent className="w-5 h-5" />,
      color: 'from-violet-500 to-violet-600',
      progress: Object.values(teamLimits).reduce((acc, { current, max }) => 
        acc + (current / max) * 100, 0) / Object.keys(teamLimits).length
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Team</h1>
          <p className="text-sm text-gray-600">
            Build your dream team within the budget and role limits
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center space-x-2">
          <Trophy size={16} />
          <span>Save Team</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {overviewCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className={`bg-gradient-to-r ${card.color} p-4`}>
              <div className="flex justify-between items-start">
                <div className="bg-white/20 rounded-lg p-2">
                  {card.icon}
                </div>
                <span className="text-xs font-medium text-white/80">
                  {card.progress.toFixed(0)}% Complete
                </span>
              </div>
              <div className="mt-4 text-white">
                <p className="text-sm font-medium opacity-80">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${card.color} transition-all duration-500`}
                  style={{ width: `${card.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {Object.entries(teamLimits).map(([role, limits]) => (
          <div key={role} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-blue-50">
                  {getRoleIcon(role)}
                </div>
                <h3 className="font-medium text-gray-900">{role}s</h3>
              </div>
              <span className={`text-sm font-medium ${limits.current === limits.max ? 'text-green-600' : 'text-blue-600'}`}>
                {limits.current}/{limits.max}
              </span>
            </div>
            <div className="relative pt-1">
              <div className="overflow-hidden h-1.5 text-xs flex rounded bg-blue-50">
                <div
                  className="transition-all duration-500 ease-out rounded bg-gradient-to-r from-blue-500 to-blue-600"
                  style={{ width: `${(limits.current / limits.max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {players.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={32} className="text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Players Selected</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Start building your dream team by adding players from the market!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {players.map(player => {
            const performance = getPerformanceIndicator(player.stats);
            
            return (
              <div key={player.id} className="bg-white rounded-lg shadow-sm overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
                <div className="relative">
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${performance.color} bg-white shadow-sm`}>
                      {performance.icon}
                      <span className="ml-1 text-[10px]">{performance.label}</span>
                    </span>
                  </div>
                  <div className="h-20 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                  <div className="absolute -bottom-4 left-3">
                  </div>
                </div>

                <div className="p-3 pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 leading-tight">{player.name}</h3>
                      <p className="text-xs text-gray-600">{player.university}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-green-600 font-bold text-sm">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          maximumFractionDigits: 0
                        }).format(player.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-1.5">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {getRoleIcon(player.role)}
                      <span className="ml-1 text-[10px]">{player.role}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="text-center p-1 rounded bg-gray-50">
                      <p className="text-gray-600 text-[10px] font-medium">Avg</p>
                      <p className="text-sm font-bold text-gray-900">{player.stats.battingAvg}</p>
                    </div>
                    <div className="text-center p-1 rounded bg-gray-50">
                      <p className="text-gray-600 text-[10px] font-medium">SR</p>
                      <p className="text-sm font-bold text-gray-900">{player.stats.strikeRate}</p>
                    </div>
                    <div className="text-center p-1 rounded bg-gray-50">
                      <p className="text-gray-600 text-[10px] font-medium">Matches</p>
                      <p className="text-sm font-bold text-gray-900">{player.stats.matches}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onRemovePlayer(player.id)}
                  className="w-full py-1.5 bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center space-x-1 text-xs"
                >
                  <Trash2 size={12} />
                  <span>Remove</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTeam;