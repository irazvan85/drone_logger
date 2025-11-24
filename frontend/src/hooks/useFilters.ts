import { useState, useCallback } from 'react';
import { Photo } from '../types';
import { post } from '../services/api';

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface FilterState {
  dateStart: string | null;
  dateEnd: string | null;
  bounds: Bounds | null;
}

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    dateStart: null,
    dateEnd: null,
    bounds: null,
  });
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setDateStart = (date: string | null) => {
    setFilters(prev => ({ ...prev, dateStart: date }));
  };

  const setDateEnd = (date: string | null) => {
    setFilters(prev => ({ ...prev, dateEnd: date }));
  };

  const setBounds = (bounds: Bounds | null) => {
    setFilters(prev => ({ ...prev, bounds }));
  };

  const toggleDrawing = () => {
    setIsDrawing(prev => !prev);
  };

  const clearFilters = () => {
    setFilters({
      dateStart: null,
      dateEnd: null,
      bounds: null,
    });
    setIsDrawing(false);
    setFilteredPhotos([]);
    setHasFiltered(false);
  };

  const applyFilters = useCallback(async () => {
    setIsLoading(true);
    try {
      const payload = {
        date_start: filters.dateStart ? new Date(filters.dateStart).toISOString() : null,
        date_end: filters.dateEnd ? new Date(filters.dateEnd).toISOString() : null,
        bounds: filters.bounds,
      };
      
      const response = await post<Photo[]>('/photos/filter', payload);
      if (response.success && response.data) {
        setFilteredPhotos(response.data);
        setHasFiltered(true);
      }
    } catch (error) {
      console.error('Failed to filter photos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  return {
    filters,
    isDrawing,
    filteredPhotos,
    hasFiltered,
    isLoading,
    setDateStart,
    setDateEnd,
    setBounds,
    toggleDrawing,
    clearFilters,
    applyFilters,
  };
};
