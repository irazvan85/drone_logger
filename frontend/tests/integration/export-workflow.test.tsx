import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '../../src/pages/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from '../../src/services/api';

// Mock API
vi.mock('../../src/services/api', async () => {
  const actual = await vi.importActual('../../src/services/api');
  return {
    ...actual,
    download: vi.fn(),
    post: vi.fn().mockResolvedValue({ success: true, data: [] }), // Mock post for filters
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Export Workflow', () => {
  it('allows user to open export dialog and trigger export', async () => {
    // Mock download response
    const mockBlob = new Blob(['test data'], { type: 'text/csv' });
    (api.download as any).mockResolvedValue(mockBlob);
    
    // Mock URL.createObjectURL
    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:test');
    window.URL.revokeObjectURL = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    );

    // Open Export Dialog
    fireEvent.click(screen.getByText('Export Data'));
    expect(screen.getByText('Export Data', { selector: 'h2' })).toBeInTheDocument();

    // Select CSV
    fireEvent.click(screen.getByLabelText(/csv/i));

    // Click Export
    fireEvent.click(screen.getByText('Export', { selector: 'button' }));

    // Verify API call
    await waitFor(() => {
      expect(api.download).toHaveBeenCalledWith('/exports', expect.objectContaining({
        format: 'csv'
      }));
    });

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText('Export successful! File downloaded.')).toBeInTheDocument();
    });
  });
});
