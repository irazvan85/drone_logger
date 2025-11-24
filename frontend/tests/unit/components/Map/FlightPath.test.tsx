import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FlightPath } from '../../../../src/components/Map/FlightPath';
import { Photo } from '../../../../src/types';

// Mock react-leaflet
vi.mock('react-leaflet', () => ({
  Polyline: vi.fn(({ positions }) => <div data-testid="polyline" data-positions={JSON.stringify(positions)} />),
}));

describe('FlightPath', () => {
  const mockPhotos: Photo[] = [
    {
      id: '1',
      filename: 'photo1.jpg',
      timestamp: '2023-01-01T10:00:00Z',
      metadata: { latitude: 10, longitude: 20 },
    } as any,
    {
      id: '2',
      filename: 'photo2.jpg',
      timestamp: '2023-01-01T10:01:00Z',
      metadata: { latitude: 11, longitude: 21 },
    } as any,
  ];

  it('renders polyline with correct positions', () => {
    const { getByTestId } = render(<FlightPath photos={mockPhotos} />);
    const polyline = getByTestId('polyline');
    const positions = JSON.parse(polyline.getAttribute('data-positions') || '[]');
    
    expect(positions).toHaveLength(2);
    expect(positions[0]).toEqual([10, 20]);
    expect(positions[1]).toEqual([11, 21]);
  });

  it('does not render if fewer than 2 photos', () => {
    const { queryByTestId } = render(<FlightPath photos={[mockPhotos[0]]} />);
    expect(queryByTestId('polyline')).not.toBeInTheDocument();
  });

  it('sorts photos by timestamp', () => {
    const unsortedPhotos = [mockPhotos[1], mockPhotos[0]];
    const { getByTestId } = render(<FlightPath photos={unsortedPhotos} />);
    const polyline = getByTestId('polyline');
    const positions = JSON.parse(polyline.getAttribute('data-positions') || '[]');
    
    expect(positions[0]).toEqual([10, 20]); // photo1 (earlier)
    expect(positions[1]).toEqual([11, 21]); // photo2 (later)
  });
});
