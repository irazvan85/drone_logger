import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExportDialog } from '../../../../src/components/Export/ExportDialog';
import * as useExportHook from '../../../../src/hooks/useExport';

describe('ExportDialog', () => {
  const mockExportData = vi.fn();
  const mockReset = vi.fn();

  beforeEach(() => {
    vi.spyOn(useExportHook, 'useExport').mockReturnValue({
      exportData: mockExportData,
      isExporting: false,
      isSuccess: false,
      error: null,
      reset: mockReset,
    });
  });

  it('does not render when isOpen is false', () => {
    render(<ExportDialog isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText('Export Data')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(<ExportDialog isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Export Data')).toBeInTheDocument();
  });

  it('calls exportData with selected format when Export button is clicked', () => {
    render(<ExportDialog isOpen={true} onClose={() => {}} />);
    
    // Select CSV
    fireEvent.click(screen.getByLabelText(/csv/i));
    
    // Click Export
    fireEvent.click(screen.getByText('Export', { selector: 'button' }));
    
    expect(mockExportData).toHaveBeenCalledWith(expect.objectContaining({
      format: 'csv'
    }));
  });

  it('calls onClose when Close button is clicked', () => {
    const onClose = vi.fn();
    render(<ExportDialog isOpen={true} onClose={onClose} />);
    
    fireEvent.click(screen.getByText('Close'));
    
    expect(onClose).toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalled();
  });

  it('displays loading state when exporting', () => {
    vi.spyOn(useExportHook, 'useExport').mockReturnValue({
      exportData: mockExportData,
      isExporting: true,
      isSuccess: false,
      error: null,
      reset: mockReset,
    });

    render(<ExportDialog isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Exporting data...')).toBeInTheDocument();
    expect(screen.getByText('Export', { selector: 'button' })).toBeDisabled();
  });
});
