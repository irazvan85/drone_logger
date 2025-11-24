import React from 'react';

interface DateRangeFilterProps {
  startDate: string | null;
  endDate: string | null;
  onStartDateChange: (date: string | null) => void;
  onEndDateChange: (date: string | null) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="date-range-filter p-4 bg-white rounded shadow mb-4">
      <h3 className="text-lg font-semibold mb-2">Date Range</h3>
      <div className="flex gap-4">
        <div className="filter-group flex-1">
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            id="start-date"
            className="w-full p-2 border rounded"
            value={startDate || ''}
            onChange={(e) => onStartDateChange(e.target.value || null)}
          />
        </div>
        <div className="filter-group flex-1">
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            id="end-date"
            className="w-full p-2 border rounded"
            value={endDate || ''}
            onChange={(e) => onEndDateChange(e.target.value || null)}
          />
        </div>
      </div>
    </div>
  );
};
