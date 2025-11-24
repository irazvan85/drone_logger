import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFlightStats } from '../../services/flightService';
import { FilterState } from '../../hooks/useFilters';

interface FlightStatsProps {
  filters: FilterState;
}

export const FlightStats: React.FC<FlightStatsProps> = ({ filters }) => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['flightStats', filters],
    queryFn: () => getFlightStats(filters),
  });

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading stats...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading stats</div>;
  }

  if (!stats) {
    return null;
  }

  const distanceKm = (stats.total_distance_meters / 1000).toFixed(2);
  const durationMinutes = Math.round(stats.total_duration_seconds / 60);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Flight Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 rounded-md">
          <div className="text-sm text-blue-600 font-medium">Total Distance</div>
          <div className="text-2xl font-bold text-blue-800">{distanceKm} km</div>
        </div>
        <div className="p-3 bg-green-50 rounded-md">
          <div className="text-sm text-green-600 font-medium">Total Photos</div>
          <div className="text-2xl font-bold text-green-800">{stats.total_photos}</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-md">
          <div className="text-sm text-purple-600 font-medium">Duration</div>
          <div className="text-2xl font-bold text-purple-800">{durationMinutes} min</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-600 font-medium">Date Range</div>
          <div className="text-sm font-semibold text-gray-800">
            {stats.date_start ? new Date(stats.date_start).toLocaleDateString() : 'N/A'} 
            {' - '}
            {stats.date_end ? new Date(stats.date_end).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};
