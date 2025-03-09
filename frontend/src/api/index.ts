import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API calls
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  
  signup: async (username: string, password: string) => {
    const response = await api.post('/auth/signup', { username, password });
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },
  
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  }
};

// Player API calls
export const playerAPI = {
  getAllPlayers: async () => {
    const response = await api.get('/players');
    return response.data;
  },
  
  getPlayerById: async (id: number) => {
    const response = await api.get(`/players/${id}`);
    return response.data;
  },
  
  getPlayersByCategory: async (category: string) => {
    const response = await api.get(`/players/category/${category}`);
    return response.data;
  }
};

// Team API calls
export const teamAPI = {
  getUserTeam: async () => {
    const response = await api.get('/team');
    return response.data;
  },
  
  addPlayerToTeam: async (playerId: number) => {
    const response = await api.post(`/team/add/${playerId}`);
    return response.data;
  },
  
  removePlayerFromTeam: async (playerId: number) => {
    const response = await api.delete(`/team/remove/${playerId}`);
    return response.data;
  },
  
  getTeamStatus: async () => {
    const response = await api.get('/team/status');
    return response.data;
  },
  
  getBudget: async () => {
    const response = await api.get('/team/budget');
    return response.data;
  },
  
  getLeaderboard: async () => {
    const response = await api.get('/team/leaderboard');
    return response.data;
  }
};

// Chatbot API calls
export const chatbotAPI = {
  sendQuery: async (query: string) => {
    const response = await api.post('/chatbot/query', { query });
    return response.data;
  },
  
  getBestTeam: async () => {
    const response = await api.get('/chatbot/best-team');
    return response.data;
  }
};

export default {
  auth: authAPI,
  players: playerAPI,
  team: teamAPI,
  chatbot: chatbotAPI
};