import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../services/api';
import { MarkerPopup } from './MarkerPopup';
import L from 'leaflet';
import { Photo } from '../../types';

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

interface MapMarkersProps {
  photos?: Photo[];
}

export const MapMarkers: React.FC<MapMarkersProps> = ({ photos }) => {
  const { data: fetchedMarkers } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await get<any[]>('/locations');
      // Backend returns array directly, not wrapped in APIResponse
      return Array.isArray(response) ? response : (response.data || []);
    },
    enabled: !photos,
  });

  const displayMarkers = React.useMemo(() => {
    if (photos) {
      return photos
        .filter(p => p.metadata)
        .map(p => ({
          id: p.id,
          location: {
            latitude: p.metadata!.latitude,
            longitude: p.metadata!.longitude
          },
          photos_count: 1,
          is_clustered: false,
          photo_ids: [p.id],
        }));
    }
    return fetchedMarkers || [];
  }, [photos, fetchedMarkers]);

  if (!displayMarkers) return null;

  return (
    <>
      {displayMarkers.map((marker: any) => (
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
