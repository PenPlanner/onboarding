import React, { useEffect, useState } from 'react';
import { Plus, Filter, Search, Calendar } from 'lucide-react';
import { useOnboardingStore } from '../../stores/onboarding';
import type { NewHire } from '../../types/index.js';
import { HireCard } from './HireCard';
import { Button } from '../ui/Button';
import { mockBatch } from '../../lib/mockData';

export const Dashboard: React.FC = () => {
  const { currentBatch, setCurrentBatch, setSelectedHire } = useOnboardingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Initialize with mock data
    setCurrentBatch(mockBatch);
  }, [setCurrentBatch]);

  const filteredHires = currentBatch?.hires.filter(hire => {
    const matchesSearch = hire.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hire.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || hire.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  const handleHireClick = (hire: NewHire) => {
    setSelectedHire(hire);
  };

  if (!currentBatch) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Loading onboarding data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentBatch.title}
          </h1>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-sm text-gray-600">
              {currentBatch.month} {currentBatch.year} • {currentBatch.totalHires} hires • {currentBatch.completedHires} completed
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 font-medium">
                Start: August 12, 2025
              </span>
              <span className="text-gray-500">
                ({Math.ceil((new Date(2025, 7, 12).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} days left)
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Switch Month
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Hire
          </Button>
        </div>
      </div>

      {/* Capacity Info */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/50 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-900">Onboarding Capacity</p>
            <p className="text-sm text-gray-600 mt-1">
              {filteredHires.length} of 12 positions filled • {currentBatch.completedHires} completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {filteredHires.length}/12
            </div>
            <div className="text-sm text-gray-500">positions</div>
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden relative">
          <div 
            className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out shadow-md relative"
            style={{ width: `${(filteredHires.length / 12) * 100}%` }}
          >
            {/* Capacity glow effect */}
            {filteredHires.length > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full opacity-30" />
            )}
            
            {/* Shine effect */}
            {filteredHires.length > 1 && (
              <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-40 rounded-full" />
            )}
          </div>
          
          {/* Full capacity celebration */}
          {filteredHires.length === 12 && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse opacity-50" />
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 bg-white rounded-2xl p-4 border border-gray-200/50">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search hires..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="delayed">Delayed</option>
          </select>
        </div>
      </div>

      {/* Hires List */}
      <div className="space-y-3">
        {filteredHires.map(hire => (
          <HireCard
            key={hire.id}
            hire={hire}
            onClick={() => handleHireClick(hire)}
          />
        ))}
      </div>

      {filteredHires.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hires found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};