import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { MarkerPopup } from './MarkerPopup';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export const MapMarkers: React.FC = () => {
  const { data: markers } = useQuery({
    queryKey: ['locations'],
    queryFn: () => api.get('/locations').then(res => res.data),
  });

  if (!markers) return null;

  return (
    <>
      {markers.map((marker: any) => (
        <Marker 
          key={marker.id} 
          position={[marker.location.latitude, marker.location.longitude]}
        >
          <Popup>
            <MarkerPopup marker={marker} />
          </Popup>
        </Marker>
      ))}
    </>
  );
};
