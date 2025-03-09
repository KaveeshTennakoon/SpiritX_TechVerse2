import React, { useState } from 'react';
import { Send, Trophy, Star, TrendingUp, Check, ChevronDown, ChevronUp, Award, Target, Activity } from 'lucide-react';

interface PlayerStats {
  battingAvg?: number;
  strikeRate?: number;
  matches?: number;
  centuries?: number;
  fifties?: number;
  highestScore?: number;
  wickets?: number;
  economy?: number;
  bestBowling?: string;
}

interface PlayerCardProps {
  id: number;
  name: string;
  university: string;
  role: string;
  price: number;
  stats?: PlayerStats; // Make stats optional
  onAddToTeam: () => void;
  isSelected: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  name, 
  university, 
  role, 
  price,
  stats = {}, // Provide default empty object
  onAddToTeam,
  isSelected
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);

  const getPerformanceIndicator = () => {
    // Check if stats exist and battingAvg is defined
    const battingAvg = stats?.battingAvg || 0;
    const avgScore = (battingAvg / 50) * 100;
    
    if (avgScore >= 80) return { color: 'text-green-600', icon: <TrendingUp size={14} />, label: 'Exceptional' };
    if (avgScore >= 60) return { color: 'text-blue-600', icon: <Star size={14} />, label: 'Outstanding' };
    return { color: 'text-yellow-600', icon: <Trophy size={14} />, label: 'Good' };
  };

  const performance = getPerformanceIndicator();

  const getRoleIcon = () => {
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

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-[1.02] ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${performance.color} bg-white shadow-sm`}>
            {performance.icon}
            <span className="ml-1 text-[10px]">{performance.label}</span>
          </span>
        </div>
        <div className="absolute -bottom-6 left-4">
          <div className="relative">
            <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
              {getRoleIcon()}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pt-8">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{name}</h3>
            <p className="text-sm text-gray-600">{university}</p>
          </div>
          <div className="text-right">
            <span className="text-green-600 font-bold">{formattedPrice}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-2 rounded-lg bg-gray-50">
            <p className="text-gray-600 text-xs font-medium">Avg</p>
            <p className="text-base font-bold text-gray-900">{stats?.battingAvg || 'N/A'}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-gray-50">
            <p className="text-gray-600 text-xs font-medium">SR</p>
            <p className="text-base font-bold text-gray-900">{stats?.strikeRate || 'N/A'}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-gray-50">
            <p className="text-gray-600 text-xs font-medium">Matches</p>
            <p className="text-base font-bold text-gray-900">{stats?.matches || 'N/A'}</p>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              {stats?.centuries !== undefined && (
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-gray-600 text-xs font-medium">Centuries</p>
                  <p className="text-base font-bold text-gray-900">{stats.centuries}</p>
                </div>
              )}
              {stats?.fifties !== undefined && (
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-gray-600 text-xs font-medium">Fifties</p>
                  <p className="text-base font-bold text-gray-900">{stats.fifties}</p>
                </div>
              )}
              {stats?.wickets !== undefined && (
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-gray-600 text-xs font-medium">Wickets</p>
                  <p className="text-base font-bold text-gray-900">{stats.wickets}</p>
                </div>
              )}
              {stats?.economy !== undefined && (
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-gray-600 text-xs font-medium">Economy</p>
                  <p className="text-base font-bold text-gray-900">{stats.economy}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex border-t border-gray-100">
        <button 
          className="flex-1 py-2.5 text-center text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-1 text-sm"
          onClick={() => setShowDetails(!showDetails)}
        >
          <span>{showDetails ? 'Hide Details' : 'View Details'}</span>
          {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button 
          className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center space-x-1 text-sm ${
            isSelected 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={onAddToTeam}
          disabled={isSelected}
        >
          {isSelected ? (
            <>
              <Check size={14} />
              <span>Added</span>
            </>
          ) : (
            'Add to Team'
          )}
        </button>
      </div>
    </div>
  );
};

export default PlayerCard;