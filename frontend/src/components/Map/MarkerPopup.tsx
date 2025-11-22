import React from 'react';

interface MarkerPopupProps {
  marker: any;
}

export const MarkerPopup: React.FC<MarkerPopupProps> = ({ marker }) => {
  return (
    <div className="p-2">
      <h3 className="font-bold text-sm">Photo Location</h3>
      <p className="text-xs text-gray-600">
        Lat: {marker.location.latitude.toFixed(6)}<br />
        Lon: {marker.location.longitude.toFixed(6)}
      </p>
      <p className="text-xs mt-1">
        Photos: {marker.photos_count}
      </p>
    </div>
  );
};
