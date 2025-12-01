import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, Polyline } from 'react-leaflet';
import LocateControl from './LocateControl';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issues in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


function FitBounds({ markers }) {
  const map = useMap();
  const [prevMarkerIds, setPrevMarkerIds] = React.useState('');

  useEffect(() => {
    if (markers.length > 0) {
      // Create a stable key from marker IDs to detect actual content changes
      const currentMarkerIds = markers.map(m => m.id).sort().join(',');

      if (currentMarkerIds !== prevMarkerIds) {
        const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
        setPrevMarkerIds(currentMarkerIds);
      }
    }
  }, [markers, map, prevMarkerIds]);

  return null;
}

export default function Map({ photos, onPhotoSelect, onDeletePhoto, dronePaths, showPaths }) {
  const defaultCenter = [51.505, -0.09]; // Default to London

  console.log('Map rendering with photos:', photos.length);
  console.log('Sample photo:', photos[0]);
  return (
    <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
      <LayersControl position="bottomright">
        <LayersControl.BaseLayer checked name="Standard">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Terrain">
          <TileLayer
            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {showPaths && dronePaths.map((path, index) => (
        <Polyline
          key={`path-${index}`}
          positions={path}
          pathOptions={{ color: 'blue', weight: 3, opacity: 0.7, dashArray: '10, 10' }}
        />
      ))}

      {photos.map((photo) => (
        <Marker key={photo.id} position={[photo.lat, photo.lng]}>
          <Popup>
            <div style={{ maxWidth: '200px' }}>
              <img src={photo.url} alt="Drone capture" style={{ width: '100%', borderRadius: '4px', cursor: 'pointer' }} onClick={() => onPhotoSelect(photo)} />
              <p style={{ margin: '5px 0 0', fontSize: '12px' }}>
                Lat: {photo.lat.toFixed(5)}<br />
                Lng: {photo.lng.toFixed(5)}
              </p>
              <div style={{ display: 'flex', gap: '5px', marginTop: '8px' }}>
                <button
                  onClick={() => onPhotoSelect(photo)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  View
                </button>
                <button
                  onClick={() => onDeletePhoto(photo)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      <FitBounds markers={photos} />
      <LocateControl />
    </MapContainer>
  );
}
