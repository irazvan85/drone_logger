import { post } from './api';
import { FilterState } from '../hooks/useFilters';

export interface FlightStats {
  total_distance_meters: number;
  total_photos: number;
  date_start: string | null;
  date_end: string | null;
  total_duration_seconds: number;
}

export const getFlightStats = async (filters: FilterState): Promise<FlightStats> => {
  const payload = {
    date_start: filters.dateStart ? new Date(filters.dateStart).toISOString() : undefined,
    date_end: filters.dateEnd ? new Date(filters.dateEnd).toISOString() : undefined,
    bounds: filters.bounds,
  };

  const response = await post<FlightStats>('/flights/stats', payload);
  if (response.data) {
    return response.data;
  }
  throw new Error('No data returned from flight stats API');
};
