import { render, screen } from '@testing-library/react';
import { MarkerPopup } from '../../../../src/components/Map/MarkerPopup';
import { describe, it, expect } from 'vitest';

describe('MarkerPopup', () => {
  const mockMarker = {
    location: { latitude: 51.505, longitude: -0.09 },
    photos_count: 5
  };

  it('displays location details', () => {
    render(<MarkerPopup marker={mockMarker} />);
    expect(screen.getByText(/Lat: 51.505000/)).toBeInTheDocument();
    expect(screen.getByText(/Lon: -0.090000/)).toBeInTheDocument();
    expect(screen.getByText(/Photos: 5/)).toBeInTheDocument();
  });
});
