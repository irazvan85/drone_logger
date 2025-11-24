import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '../../src/pages/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from '../../src/services/api';
import React from 'react';

// Mock API
vi.mock('../../src/services/api', async () => {
  const actual = await vi.importActual('../../src/services/api');
  return {
    ...actual,
    get: vi.fn(),
    post: vi.fn(),
  };
});

// Mock MapContainer to avoid Leaflet issues in test environment
vi.mock('../../src/components/Map/MapContainer', () => ({
  MapContainer: () => <div data-testid="map-container">Map</div>
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Filter Workflow', () => {
  it('allows filtering by date', async () => {
    // Mock initial locations fetch
    (api.get as any).mockResolvedValue({ data: [] });
    
    // Mock filter response
    (api.post as any).mockResolvedValue({ 
      success: true, 
      data: [
        { id: '1', filename: 'photo1.jpg', metadata_: { latitude: 45, longitude: -122 } }
      ] 
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    );

    // Check if filter panel is present
    expect(screen.getByText('Filters')).toBeInTheDocument();
    
    // Enter date
    const startDateInput = screen.getByLabelText('Start Date');
    fireEvent.change(startDateInput, { target: { value: '2023-01-01' } });
    
    // Click apply
    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);
    
    // Verify API call
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/photos/filter', expect.objectContaining({
        date_start: expect.stringContaining('2023-01-01'),
      }));
    });
  });
});
