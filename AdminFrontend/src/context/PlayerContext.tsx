import React, { createContext, useContext, useState } from 'react';

interface Player {
  id: string;
  name: string;
  university: string;
  category: string;
  value: string;
  image: string;
}

interface PlayerContextType {
  players: Player[];
  addPlayer: (player: Omit<Player, 'id'>) => void;
  deletePlayer: (id: string) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 'P001',
      name: 'Virat Singh',
      university: 'Delhi University',
      category: 'Batsman',
      value: '₹ 9,500,000',
      image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
    },
    {
      id: 'P002',
      name: 'Rahul Kumar',
      university: 'Mumbai University',
      category: 'Bowler',
      value: '₹ 8,500,000',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    },
    {
      id: 'P003',
      name: 'Ajay Patel',
      university: 'Bangalore University',
      category: 'All-rounder',
      value: '₹ 9,000,000',
      image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    },
    {
      id: 'P004',
      name: 'Suresh Raina',
      university: 'Chennai University',
      category: 'Batsman',
      value: '₹ 8,000,000',
      image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    },
  ]);

  const addPlayer = (newPlayer: Omit<Player, 'id'>) => {
    const player: Player = {
      ...newPlayer,
      id: `P${String(players.length + 1).padStart(3, '0')}`,
    };
    setPlayers([...players, player]);
  };

  const deletePlayer = (id: string) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  return (
    <PlayerContext.Provider value={{ players, addPlayer, deletePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayers() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayers must be used within a PlayerProvider');
  }
  return context;
}