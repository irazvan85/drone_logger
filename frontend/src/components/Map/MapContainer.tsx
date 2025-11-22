import React from 'react';
import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapMarkers } from './MapMarkers';
import { useMapStore } from '../../hooks/useMap';

export const MapContainer: React.FC = () => {
  const { center, zoom } = useMapStore();

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-md border border-gray-200">
      <LeafletMap center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapMarkers />
      </LeafletMap>
    </div>
  );
};
