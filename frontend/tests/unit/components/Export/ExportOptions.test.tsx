import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExportOptions } from '../../../../src/components/Export/ExportOptions';

describe('ExportOptions', () => {
  it('renders all format options', () => {
    const setFormat = vi.fn();
    render(<ExportOptions format="geojson" setFormat={setFormat} />);
    
    expect(screen.getByLabelText(/geojson/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/csv/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kml/i)).toBeInTheDocument();
  });

  it('calls setFormat when an option is selected', () => {
    const setFormat = vi.fn();
    render(<ExportOptions format="geojson" setFormat={setFormat} />);
    
    fireEvent.click(screen.getByLabelText(/csv/i));
    expect(setFormat).toHaveBeenCalledWith('csv');
  });

  it('shows the currently selected format as checked', () => {
    const setFormat = vi.fn();
    render(<ExportOptions format="kml" setFormat={setFormat} />);
    
    const kmlInput = screen.getByLabelText(/kml/i) as HTMLInputElement;
    expect(kmlInput.checked).toBe(true);
    
    const csvInput = screen.getByLabelText(/csv/i) as HTMLInputElement;
    expect(csvInput.checked).toBe(false);
  });
});
