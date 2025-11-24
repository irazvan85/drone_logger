import React from 'react';
import { Polyline } from 'react-leaflet';
import { Photo } from '../../types';

interface FlightPathProps {
  photos: Photo[];
  color?: string;
}

export const FlightPath: React.FC<FlightPathProps> = ({ photos, color = 'blue' }) => {
  // Sort photos by timestamp to ensure correct path order
  const sortedPhotos = [...photos].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const positions = sortedPhotos
    .filter(p => p.metadata)
    .map(p => [p.metadata!.latitude, p.metadata!.longitude] as [number, number]);

  if (positions.length < 2) {
    return null;
  }

  return <Polyline positions={positions} color={color} />;
};
