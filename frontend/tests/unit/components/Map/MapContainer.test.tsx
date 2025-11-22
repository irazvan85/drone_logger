import { render, screen } from '@testing-library/react';
import { MapContainer } from '../../../../src/components/Map/MapContainer';
import { vi, describe, it, expect } from 'vitest';

// Mock react-leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="leaflet-map">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
}));

// Mock MapMarkers
vi.mock('../../../../src/components/Map/MapMarkers', () => ({
  MapMarkers: () => <div data-testid="map-markers" />,
}));

describe('MapContainer', () => {
  it('renders map with correct components', () => {
    render(<MapContainer />);
    expect(screen.getByTestId('leaflet-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
    expect(screen.getByTestId('map-markers')).toBeInTheDocument();
  });
});
