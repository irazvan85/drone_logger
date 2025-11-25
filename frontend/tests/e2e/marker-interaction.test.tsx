import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MapContainer } from '../../src/components/Map/MapContainer';
import { Photo } from '../../src/types';
import React from 'react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock Leaflet components
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: any) => <div data-testid="map-marker">{children}</div>,
  Popup: ({ children }: any) => <div data-testid="marker-popup">{children}</div>,
  useMap: () => ({ fitBounds: vi.fn() }),
}));

// Mock useMapStore
vi.mock('../../src/hooks/useMap', () => ({
  useMapStore: () => ({
    center: [0, 0],
    zoom: 13,
  }),
}));

// Mock FlightPath
vi.mock('../../src/components/Map/FlightPath', () => ({
  FlightPath: () => <div data-testid="flight-path" />,
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Map Marker Interaction', () => {
  const mockPhotos: Photo[] = [
    {
      id: '1',
      filename: 'photo1.jpg',
      file_path: '/path/to/photo1.jpg',
      timestamp: '2023-01-01T12:00:00Z',
      file_size: 1024,
      format: 'jpg',
      collection_id: 'col1',
      created_at: '2023-01-01T12:00:00Z',
      updated_at: '2023-01-01T12:00:00Z',
      metadata: {
        id: 'meta1',
        latitude: 37.7749,
        longitude: -122.4194,
        altitude: 100,
        photo_id: '1',
        camera_model: 'Test Camera',
        iso: 100,
        shutter_speed: '1/100',
        aperture: 'f/2.8'
      },
    },
  ];

  it('renders markers and popups for photos', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MapContainer photos={mockPhotos} />
      </QueryClientProvider>
    );

    const markers = screen.getAllByTestId('map-marker');
    expect(markers).toHaveLength(1);

    // In our mock, Popup is always rendered inside Marker
    const popup = screen.getByTestId('marker-popup');
    expect(popup).toBeInTheDocument();

    // Check popup content
    expect(screen.getByText('Photo Location')).toBeInTheDocument();
    expect(screen.getByText(/Lat: 37.774900/)).toBeInTheDocument();
    expect(screen.getByText(/Lon: -122.419400/)).toBeInTheDocument();
  });
});
