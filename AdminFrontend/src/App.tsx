import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, Trophy, Settings, Home, LogOut } from 'lucide-react';
import { PlayerProvider } from './context/PlayerContext';
import { UserProvider } from './context/UserContext';
import { useUser } from './context/UserContext';

// Components
import Dashboard from './components/Dashboard';
import Players from './components/Players';
import Tournament from './components/Tournament';
import SettingsPage from './components/Settings';

function Sidebar() {
  const location = useLocation();
  const { user } = useUser();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/players', icon: Users, label: 'Players' },
    { path: '/tournament', icon: Trophy, label: 'Tournament' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 min-h-screen flex flex-col">
      <div className="text-xl font-bold mb-8">Spirit11</div>
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="pt-8">
        <div className="flex items-center space-x-3 px-4 py-2">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop"
            alt="Admin"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-gray-500">Super Admin</div>
          </div>
        </div>
        <button className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg w-full mt-2">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/players" element={<Players />} />
          <Route path="/tournament" element={<Tournament />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <PlayerProvider>
          <AppContent />
        </PlayerProvider>
      </UserProvider>
    </Router>
  );
}

export default App;