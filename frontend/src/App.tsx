import React, { useState, useEffect } from 'react';
import { Bell, Trophy, Users, Home, LineChart, Wallet2, X, Settings, AlertCircle, Search, Filter, Award, Target, Activity, DollarSign, Percent } from 'lucide-react';
import PlayerCard from './components/PlayerCard';
import BudgetTracker from './components/BudgetTracker';
import MyTeam from './components/MyTeam';
import Leaderboard from './components/Leaderboard';
import ChatAssistant from './components/ChatAssistant';
import Login from './components/Login';
import Signup from './components/Signup';
import { authAPI, playerAPI, teamAPI } from './api';
import { Player } from './data/players';

interface TeamLimits {
  [key: string]: { current: number; max: number };
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignupView, setIsSignupView] = useState(false);
  const [activeTab, setActiveTab] = useState('players');
  const [showChat, setShowChat] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Your team scored 250 points in the last match!",
      time: "2 hours ago"
    },
    {
      id: 2,
      message: "New player added to the transfer market",
      time: "5 hours ago"
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [universityFilter, setUniversityFilter] = useState('All Universities');
  const [searchQuery, setSearchQuery] = useState('');
  const [budget, setBudget] = useState(9000000);
  const [isLoading, setIsLoading] = useState(false);

  const TOTAL_BUDGET = 9000000;
  const teamLimits: TeamLimits = {
    'Batsman': { current: 0, max: 4 },
    'Bowler': { current: 0, max: 4 },
    'All-rounder': { current: 0, max: 2 },
    'Wicket-keeper': { current: 0, max: 1 }
  };

  // Update team limits based on selected players
  selectedPlayers.forEach(player => {
    if (teamLimits[player.role]) {
      teamLimits[player.role].current += 1;
    }
  });

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = authAPI.isLoggedIn();
    setIsAuthenticated(isLoggedIn);
    
    if (isLoggedIn) {
      fetchInitialData();
    }
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      // Fetch all players
      const playersData = await playerAPI.getAllPlayers();
      setPlayers(playersData);
      
      // Fetch user's team
      const teamData = await teamAPI.getUserTeam();
      setSelectedPlayers(teamData.team);
      
      // Fetch budget
      const budgetData = await teamAPI.getBudget();
      setBudget(budgetData.available_budget);
    } catch (error) {
      showAlertMessage('Failed to load data from server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    fetchInitialData();
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setSelectedPlayers([]);
    setBudget(TOTAL_BUDGET);
  };

  const handleAddToTeam = async (player: Player) => {
    if (selectedPlayers.some(p => p.id === player.id)) {
      showAlertMessage('This player is already in your team');
      return;
    }

    if (teamLimits[player.role].current >= teamLimits[player.role].max) {
      showAlertMessage(`You can't add more ${player.role}s to your team`);
      return;
    }

    if (player.price > budget) {
      showAlertMessage('Not enough budget to add this player');
      return;
    }

    if (selectedPlayers.length >= 11) {
      showAlertMessage('Your team is already full');
      return;
    }

    try {
      await teamAPI.addPlayerToTeam(player.id);
      
      // Update local state
      setSelectedPlayers([...selectedPlayers, player]);
      setBudget(budget - player.price);
      
      // Add notification
      setNotifications([
        {
          id: Date.now(),
          message: `${player.name} added to your team!`,
          time: 'just now'
        },
        ...notifications
      ]);
    } catch (error: any) {
      showAlertMessage(error.response?.data?.message || 'Failed to add player to team');
    }
  };

  const handleRemoveFromTeam = async (playerId: number) => {
    const player = selectedPlayers.find(p => p.id === playerId);
    if (!player) return;
    
    try {
      await teamAPI.removePlayerFromTeam(playerId);
      
      // Update local state
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== playerId));
      setBudget(budget + player.price);
      
      // Add notification
      setNotifications([
        {
          id: Date.now(),
          message: `${player.name} removed from your team`,
          time: 'just now'
        },
        ...notifications
      ]);
    } catch (error: any) {
      showAlertMessage(error.response?.data?.message || 'Failed to remove player from team');
    }
  };

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const filteredPlayers = players.filter(player => {
    const matchesRole = roleFilter === 'All Roles' || player.role === roleFilter;
    const matchesUniversity = universityFilter === 'All Universities' || player.university === universityFilter;
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         player.university.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesUniversity && matchesSearch;
  });

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

  const overviewCards = [
    {
      title: 'Available Players',
      value: filteredPlayers.length,
      icon: <Users className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      progress: (filteredPlayers.length / players.length) * 100 || 0
    },
    {
      title: 'Budget Available',
      value: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(budget),
      icon: <DollarSign className="w-5 h-5" />,
      color: 'from-emerald-500 to-emerald-600',
      progress: (budget / TOTAL_BUDGET) * 100
    },
    {
      title: 'Squad Completion',
      value: `${selectedPlayers.length}/11`,
      icon: <Percent className="w-5 h-5" />,
      color: 'from-violet-500 to-violet-600',
      progress: (selectedPlayers.length / 11) * 100
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {isSignupView ? (
          <Signup 
            onSignupSuccess={handleLoginSuccess} 
            onSwitchToLogin={() => setIsSignupView(false)} 
          />
        ) : (
          <div className="w-full max-w-md">
            <Login onLoginSuccess={handleLoginSuccess} />
            <p className="text-center mt-4">
              Don't have an account?{' '}
              <button 
                className="text-blue-600 hover:underline"
                onClick={() => setIsSignupView(true)}
              >
                Sign up
              </button>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-[#1e1b4b] text-white min-h-screen p-4">
        <div className="flex items-center space-x-2 mb-8">
          <Trophy size={24} />
          <span className="text-xl font-semibold">Spirit11</span>
        </div>
        
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('players')}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'players' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
          >
            <Users size={20} />
            <span>Players Market</span>
          </button>
          <button 
            onClick={() => setActiveTab('my-team')}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'my-team' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
          >
            <Home size={20} />
            <span>My Team</span>
          </button>
          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'leaderboard' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
          >
            <LineChart size={20} />
            <span>Leaderboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('budget')}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'budget' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
          >
            <Wallet2 size={20} />
            <span>Budget</span>
          </button>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center space-x-2 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              {authAPI.getCurrentUser()?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <span className="block text-sm">{authAPI.getCurrentUser()?.username || 'User'}</span>
              <span className="block text-xs text-gray-400">Player</span>
            </div>
            <div className="relative">
              <Bell 
                size={18} 
                className="text-gray-400 hover:text-white cursor-pointer"
                onClick={() => setShowNotifications(!showNotifications)}
              />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
              {showNotifications && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg py-2">
                  {notifications.map(notification => (
                    <div key={notification.id} className="px-4 py-2 hover:bg-gray-50">
                      <p className="text-sm">{notification.message}</p>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Settings size={18} className="text-gray-400 hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'players' && (
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Players Market</h1>
                    <p className="text-sm text-gray-600">
                      Find and recruit the best players for your team
                    </p>
                  </div>
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
    
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Search players by name or university..."
                          className="w-full pl-10 pr-4 py-2 border rounded-lg"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <select 
                        className="px-4 py-2 border rounded-lg"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                      >
                        <option>All Roles</option>
                        <option>Batsman</option>
                        <option>Bowler</option>
                        <option>All-rounder</option>
                      </select>
                      <select 
                        className="px-4 py-2 border rounded-lg"
                        value={universityFilter}
                        onChange={(e) => setUniversityFilter(e.target.value)}
                      >
                        <option>All Universities</option>
                        <option>Delhi University</option>
                        <option>Mumbai University</option>
                        <option>Punjab University</option>
                      </select>
                      <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg">
                        <Filter size={20} />
                        <span>More Filters</span>
                      </button>
                    </div>
    
                    <div className="relative flex-1 min-h-0">
                      <div className="absolute inset-0 overflow-x-auto">
                        <div className="inline-flex space-x-6 min-w-full px-1">
                          {filteredPlayers.map(player => (
                            <div key={player.id} className="w-[300px] flex-none">
                              <PlayerCard
                                {...player}
                                onAddToTeam={() => handleAddToTeam(player)}
                                isSelected={selectedPlayers.some(p => p.id === player.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent" />
                      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent" />
                    </div>
                  </div>
                )}
                
                {activeTab === 'my-team' && (
                  <MyTeam 
                    players={selectedPlayers}
                    onRemovePlayer={handleRemoveFromTeam}
                    teamLimits={teamLimits}
                    totalBudget={TOTAL_BUDGET}
                    remainingBudget={budget}
                  />
                )}
                {activeTab === 'budget' && (
                  <BudgetTracker 
                    totalBudget={TOTAL_BUDGET}
                    selectedPlayers={selectedPlayers}
                    onRemovePlayer={handleRemoveFromTeam}
                  />
                )}
                {activeTab === 'leaderboard' && <Leaderboard />}
              </>
            )}
          </div>
    
          {showAlert && (
            <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center space-x-2">
              <AlertCircle size={20} />
              <p>{alertMessage}</p>
            </div>
          )}
    
          <div className="fixed bottom-4 right-4">
            {showChat ? (
              <div className="bg-white rounded-lg shadow-xl w-80">
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Trophy size={20} className="text-blue-600" />
                    <span className="font-semibold">Fantasy Assistant</span>
                  </div>
                  <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={20} />
                  </button>
                </div>
                <ChatAssistant />
              </div>
            ) : (
              <button
                onClick={() => setShowChat(true)}
                className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
              >
                <Trophy size={24} />
              </button>
            )}
          </div>
        </div>
      );
    }
    
    export default App;