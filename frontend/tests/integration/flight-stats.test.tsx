import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '../../src/pages/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from '../../src/services/api';

// Mock API
vi.mock('../../src/services/api', async () => {
  const actual = await vi.importActual('../../src/services/api');
  return {
    ...actual,
    post: vi.fn(),
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Flight Stats Integration', () => {
  it('fetches and displays flight stats', async () => {
    // Mock stats response
    const mockStats = {
      total_distance_meters: 1500,
      total_photos: 10,
      date_start: '2023-01-01T10:00:00Z',
      date_end: '2023-01-01T11:00:00Z',
      total_duration_seconds: 3600, // 1 hour
    };
    
    (api.post as any).mockImplementation((url: string) => {
      if (url === '/flights/stats') {
        return Promise.resolve({ success: true, data: mockStats });
      }
      return Promise.resolve({ success: true, data: [] });
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    );

    // Verify stats are displayed
    await waitFor(() => {
      expect(screen.getByText('Flight Statistics')).toBeInTheDocument();
      expect(screen.getByText('1.50 km')).toBeInTheDocument(); // 1500m = 1.50km
      expect(screen.getByText('10')).toBeInTheDocument(); // Total photos
      expect(screen.getByText('60 min')).toBeInTheDocument(); // 3600s = 60min
    });
  });
});
