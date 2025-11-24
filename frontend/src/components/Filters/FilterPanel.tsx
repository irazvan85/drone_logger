import React from 'react';
import { DateRangeFilter } from './DateRangeFilter';
import { BoundingBoxFilter } from './BoundingBoxFilter';
import { useFilters } from '../../hooks/useFilters';

interface FilterPanelProps {
  filters: ReturnType<typeof useFilters>;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters }) => {
  return (
    <div className="filter-panel p-4 bg-gray-100 border-r h-full overflow-y-auto w-80">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      
      <DateRangeFilter
        startDate={filters.filters.dateStart}
        endDate={filters.filters.dateEnd}
        onStartDateChange={filters.setDateStart}
        onEndDateChange={filters.setDateEnd}
      />
      
      <BoundingBoxFilter
        bounds={filters.filters.bounds}
        isDrawing={filters.isDrawing}
        onToggleDrawing={filters.toggleDrawing}
        onClearBounds={() => filters.setBounds(null)}
      />
      
      <div className="flex gap-2 mt-4">
        <button
          onClick={filters.applyFilters}
          disabled={filters.isLoading}
          className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {filters.isLoading ? 'Applying...' : 'Apply Filters'}
        </button>
        
        <button
          onClick={filters.clearFilters}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
