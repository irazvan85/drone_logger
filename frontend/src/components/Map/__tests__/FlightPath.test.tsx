import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FlightPath } from '../FlightPath';
import { Photo } from '../../../types';

// Mock Polyline
vi.mock('react-leaflet', () => ({
  Polyline: vi.fn(({ positions }) => <div data-testid="polyline" data-positions={JSON.stringify(positions)} />),
}));

describe('FlightPath', () => {
  const mockPhotos: Photo[] = [
    {
      id: '1',
      filename: 'p1.jpg',
      timestamp: '2023-01-01T10:00:00Z',
      metadata: { latitude: 10, longitude: 10, altitude: 100 },
    } as unknown as Photo,
    {
      id: '2',
      filename: 'p2.jpg',
      timestamp: '2023-01-01T10:01:00Z',
      metadata: { latitude: 11, longitude: 11, altitude: 100 },
    } as unknown as Photo,
  ];

  it('renders nothing if fewer than 2 photos', () => {
    const { container } = render(<FlightPath photos={[mockPhotos[0]]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a polyline with correct positions', () => {
    const { getByTestId } = render(<FlightPath photos={mockPhotos} />);
    const polyline = getByTestId('polyline');
    
    const positions = JSON.parse(polyline.getAttribute('data-positions') || '[]');
    expect(positions).toHaveLength(2);
    expect(positions[0]).toEqual([10, 10]);
    expect(positions[1]).toEqual([11, 11]);
  });

  it('sorts photos by timestamp', () => {
    const unsortedPhotos = [mockPhotos[1], mockPhotos[0]];
    const { getByTestId } = render(<FlightPath photos={unsortedPhotos} />);
    const polyline = getByTestId('polyline');
    
    const positions = JSON.parse(polyline.getAttribute('data-positions') || '[]');
    expect(positions[0]).toEqual([10, 10]); // p1 (earlier)
    expect(positions[1]).toEqual([11, 11]); // p2 (later)
  });
});
