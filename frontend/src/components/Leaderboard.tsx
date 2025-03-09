import React, { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCw, Trophy, School, Wallet, LineChart } from 'lucide-react';
import { paginateData } from '../utils/pagination';
import { teamAPI } from '../api';
import { LeaderboardEntry } from '../data/leaderboard';

const ITEMS_PER_PAGE = 5;

const Leaderboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('All Universities');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await teamAPI.getLeaderboard();
      
      // Map backend data to frontend LeaderboardEntry format
      const mappedData: LeaderboardEntry[] = response.map((item: any) => ({
        id: item.id,
        username: item.username,
        name: item.username, // Backend might not have separate name field
        university: 'University', // Backend might not have this field
        points: item.team_points,
        rank: 0, // Will be calculated
        teamValue: 0, // Will be set if available
        matchesPlayed: 0, // Placeholder
        winRate: 0, // Placeholder
        avatar: '', // Placeholder
        is_current_user: item.is_current_user
      }));
      
      // Set current user ID
      const currentUser = mappedData.find(user => user.is_current_user);
      if (currentUser) {
        setCurrentUserId(currentUser.id);
      }
      
      setLeaderboardData(mappedData);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = useMemo(() => {
    const currentUser = leaderboardData.find(entry => entry.id === currentUserId);
    return {
      rank: currentUser?.rank || 0,
      rankChange: 0,
      points: currentUser?.points || 0,
      pointsChange: 0,
      universityRank: 0,
      universityRankChange: 0,
      teamValue: '0',
      teamValueChange: '0'
    };
  }, [leaderboardData, currentUserId]);

  const universities = useMemo(() => {
    const uniqueUniversities = new Set(leaderboardData.map(entry => entry.university));
    return ['All Universities', ...Array.from(uniqueUniversities)];
  }, [leaderboardData]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...leaderboardData];
    
    if (selectedUniversity !== 'All Universities') {
      filtered = filtered.filter(entry => entry.university === selectedUniversity);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.name.toLowerCase().includes(query) ||
        entry.username.toLowerCase().includes(query) ||
        entry.university.toLowerCase().includes(query)
      );
    }

    // Always sort by points in descending order
    filtered.sort((a, b) => b.points - a.points);
    
    // Update ranks based on current sorting
    return filtered.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  }, [searchQuery, selectedUniversity, selectedTimeframe, leaderboardData]);

  // Paginate the filtered data
  const paginatedData = useMemo(() => 
    paginateData(filteredData, currentPage, ITEMS_PER_PAGE),
    [filteredData, currentPage]
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearchQuery('');
    setSelectedUniversity('All Universities');
    setSelectedTimeframe('all');
    fetchLeaderboard();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500">Your Rank</h3>
            <Trophy className="text-blue-600" size={24} />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">#{stats.rank}</span>
            {stats.rankChange !== 0 && (
              <span className={stats.rankChange > 0 ? "text-green-500 ml-2" : "text-red-500 ml-2"}>
                {stats.rankChange > 0 ? `+${stats.rankChange}` : stats.rankChange}
              </span>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500">Total Points</h3>
            <LineChart className="text-blue-600" size={24} />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">{stats.points.toLocaleString()}</span>
            {stats.pointsChange !== 0 && (
              <span className={stats.pointsChange > 0 ? "text-green-500 ml-2" : "text-red-500 ml-2"}>
                {stats.pointsChange > 0 ? `+${stats.pointsChange}` : stats.pointsChange}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500">University Rank</h3>
            <School className="text-blue-600" size={24} />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">#{stats.universityRank || 'N/A'}</span>
            {stats.universityRankChange !== 0 && (
              <span className={stats.universityRankChange > 0 ? "text-green-500 ml-2" : "text-red-500 ml-2"}>
                {stats.universityRankChange > 0 ? `+${stats.universityRankChange}` : stats.universityRankChange}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500">Team Value</h3>
            <Wallet className="text-blue-600" size={24} />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">₹{stats.teamValue || 'N/A'}</span>
            {stats.teamValueChange !== '0' && (
              <span className="text-green-500 ml-2">+{stats.teamValueChange}</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Leaderboard</h2>
          </div>

          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, username, or university..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex items-center space-x-4">
              <select 
                className="border rounded-lg px-4 py-2"
                value={selectedUniversity}
                onChange={(e) => {
                  setSelectedUniversity(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {universities.map(university => (
                  <option key={university} value={university}>
                    {university}
                  </option>
                ))}
              </select>
              <select 
                className="border rounded-lg px-4 py-2"
                value={selectedTimeframe}
                onChange={(e) => {
                  setSelectedTimeframe(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="week">This Week</option>
              </select>
              <button 
                className="p-2 border rounded-lg hover:bg-gray-50"
                onClick={handleRefresh}
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-600">Loading leaderboard data...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Player</th>
                    <th className="px-6 py-4">Points</th>
                    <th className="px-6 py-4">Team Value</th>
                    <th className="px-6 py-4">Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No leaderboard entries found
                      </td>
                    </tr>
                  ) : (
                    paginatedData.data.map((entry) => (
                      <tr 
                        key={entry.id} 
                        className={`border-b ${entry.id === currentUserId ? 'bg-blue-50' : ''} hover:bg-gray-50 transition-colors`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{entry.rank}</span>
                            {entry.rank <= 3 && (
                              <span className="text-yellow-500">
                                <Trophy size={16} />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-semibold">{entry.name}</p>
                              <p className="text-sm text-gray-500">@{entry.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold">{entry.points.toLocaleString()}</td>
                        <td className="px-6 py-4">₹{entry.teamValue ? (entry.teamValue / 1000000).toFixed(1) + 'M' : 'N/A'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{entry.winRate || 0}%</span>
                            <span className="text-gray-500 text-sm">({entry.matchesPlayed || 0} matches)</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, paginatedData.pagination.total)} of {paginatedData.pagination.total} entries
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    className={`px-4 py-2 border rounded-lg ${!paginatedData.pagination.hasPrev ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!paginatedData.pagination.hasPrev}
                  >
                    Previous
                  </button>
                  {Array.from({ length: paginatedData.pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === paginatedData.pagination.totalPages || 
                      Math.abs(page - currentPage) <= 1
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2">...</span>
                        )}
                        <button
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'border hover:bg-gray-50'
                          }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                  <button
                    className={`px-4 py-2 border rounded-lg ${!paginatedData.pagination.hasNext ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!paginatedData.pagination.hasNext}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;