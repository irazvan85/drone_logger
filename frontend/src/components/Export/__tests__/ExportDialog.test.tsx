import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExportDialog } from '../ExportDialog';
import * as useExportHook from '../../../hooks/useExport';

describe('ExportDialog', () => {
  const mockExportData = vi.fn();
  const mockReset = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(useExportHook, 'useExport').mockReturnValue({
      exportData: mockExportData,
      isExporting: false,
      isSuccess: false,
      error: null,
      reset: mockReset,
    });
  });

  it('does not render when isOpen is false', () => {
    render(<ExportDialog isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByText(/Export Data/i)).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(<ExportDialog isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText(/Export Data/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export/i })).toBeInTheDocument();
  });

  it('calls exportData with correct arguments when Export button is clicked', () => {
    render(<ExportDialog isOpen={true} onClose={mockOnClose} filterCriteria={{ date_start: '2023-01-01' }} />);
    
    // Select CSV format
    fireEvent.click(screen.getByLabelText(/CSV/i));
    
    fireEvent.click(screen.getByRole('button', { name: /Export/i }));
    
    expect(mockExportData).toHaveBeenCalledWith({
      format: 'csv',
      date_start: '2023-01-01'
    });
  });

  it('disables buttons when exporting', () => {
    vi.spyOn(useExportHook, 'useExport').mockReturnValue({
      exportData: mockExportData,
      isExporting: true,
      isSuccess: false,
      error: null,
      reset: mockReset,
    });

    render(<ExportDialog isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByRole('button', { name: /Export/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Close/i })).toBeDisabled();
  });

  it('calls onClose and reset when Close button is clicked', () => {
    render(<ExportDialog isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Close/i }));
    
    expect(mockReset).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});
