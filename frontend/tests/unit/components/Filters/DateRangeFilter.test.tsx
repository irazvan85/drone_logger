import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DateRangeFilter } from '../../../../src/components/Filters/DateRangeFilter';
import React from 'react';

describe('DateRangeFilter', () => {
  it('renders date inputs', () => {
    render(
      <DateRangeFilter
        startDate={null}
        endDate={null}
        onStartDateChange={() => {}}
        onEndDateChange={() => {}}
      />
    );
    
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
  });

  it('calls onChange handlers', () => {
    const onStartChange = vi.fn();
    const onEndChange = vi.fn();
    
    render(
      <DateRangeFilter
        startDate={null}
        endDate={null}
        onStartDateChange={onStartChange}
        onEndDateChange={onEndChange}
      />
    );
    
    fireEvent.change(screen.getByLabelText('Start Date'), { target: { value: '2023-01-01' } });
    expect(onStartChange).toHaveBeenCalledWith('2023-01-01');
    
    fireEvent.change(screen.getByLabelText('End Date'), { target: { value: '2023-12-31' } });
    expect(onEndChange).toHaveBeenCalledWith('2023-12-31');
  });
});
