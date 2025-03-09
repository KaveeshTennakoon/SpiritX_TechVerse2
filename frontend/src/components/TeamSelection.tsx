import React, { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';

const TeamSelection = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Select Your Team</h2>
        <div className="flex items-center space-x-2">
          <span className="text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm">
            Budget Remaining: ₹7,500,000
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Batsmen</p>
            <p className="font-semibold">2 / 4</p>
          </div>
          <div className="w-16 h-2 bg-blue-100 rounded-full">
            <div className="w-1/2 h-full bg-blue-600 rounded-full" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Bowlers</p>
            <p className="font-semibold">3 / 4</p>
          </div>
          <div className="w-16 h-2 bg-blue-100 rounded-full">
            <div className="w-3/4 h-full bg-blue-600 rounded-full" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">All-rounders</p>
            <p className="font-semibold">1 / 2</p>
          </div>
          <div className="w-16 h-2 bg-blue-100 rounded-full">
            <div className="w-1/2 h-full bg-blue-600 rounded-full" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Wicket-keeper</p>
            <p className="font-semibold">0 / 1</p>
          </div>
          <div className="w-16 h-2 bg-blue-100 rounded-full">
            <div className="w-0 h-full bg-blue-600 rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Batsmen ( 24 )
        </button>
        <button className="bg-white text-gray-700 px-4 py-2 rounded-lg">
          Bowlers ( 20 )
        </button>
        <button className="bg-white text-gray-700 px-4 py-2 rounded-lg">
          All-rounders ( 16 )
        </button>
        <button className="bg-white text-gray-700 px-4 py-2 rounded-lg">
          Wicket-keepers ( 8 )
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search players..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg">
            <Filter size={20} />
            <span>University</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg">
            <Filter size={20} />
            <span>Sort by</span>
          </button>
          <div className="flex border rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Array(8).fill(null).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                alt="Player"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">Virat Singh</h3>
                <p className="text-sm text-gray-600">Delhi University</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Avg</p>
                <p className="font-semibold">45.5</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">SR</p>
                <p className="font-semibold">138.2</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-semibold">₹800,000</span>
              <button className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm">
                Add to Team
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSelection;