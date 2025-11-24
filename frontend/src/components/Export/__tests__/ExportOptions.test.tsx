import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExportOptions } from '../ExportOptions';

describe('ExportOptions', () => {
  it('renders all format options', () => {
    const setFormat = vi.fn();
    render(<ExportOptions format="geojson" setFormat={setFormat} />);

    expect(screen.getByLabelText(/GeoJSON/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CSV/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/KML/i)).toBeInTheDocument();
  });

  it('calls setFormat when an option is selected', () => {
    const setFormat = vi.fn();
    render(<ExportOptions format="geojson" setFormat={setFormat} />);

    fireEvent.click(screen.getByLabelText(/CSV/i));
    expect(setFormat).toHaveBeenCalledWith('csv');

    fireEvent.click(screen.getByLabelText(/KML/i));
    expect(setFormat).toHaveBeenCalledWith('kml');
  });

  it('shows the currently selected format as checked', () => {
    const setFormat = vi.fn();
    render(<ExportOptions format="csv" setFormat={setFormat} />);

    expect(screen.getByLabelText(/CSV/i)).toBeChecked();
    expect(screen.getByLabelText(/GeoJSON/i)).not.toBeChecked();
  });
});
