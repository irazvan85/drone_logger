import React, { useState } from 'react';
import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapMarkers } from './MapMarkers';
import { FlightPath } from './FlightPath';
import { MapControls } from './MapControls';
import { useMapStore } from '../../hooks/useMap';
import { Photo } from '../../types';

interface MapContainerProps {
  photos?: Photo[];
}

export const MapContainer: React.FC<MapContainerProps> = ({ photos }) => {
  const { center, zoom } = useMapStore();
  const [showPath, setShowPath] = useState(true);

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden shadow-md border border-gray-200">
      <div className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded shadow">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showPath}
            onChange={(e) => setShowPath(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Show Flight Path</span>
        </label>
      </div>

      <LeafletMap center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapMarkers photos={photos} />
        {showPath && photos && <FlightPath photos={photos} />}
        <MapControls />
      </LeafletMap>
    </div>
  );
};
