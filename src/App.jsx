import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import Uploader from './components/Uploader';
import PhotoModal from './components/PhotoModal';
import Settings from './components/Settings';
import { savePhoto, getPhotos, deletePhoto, deleteAll, verifyPermission } from './db';
import { geocodeLocation, calculateDistance } from './geocoding';
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [altitudeMin, setAltitudeMin] = useState('');
  const [altitudeMax, setAltitudeMax] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [searchRadius, setSearchRadius] = useState('10');
  const [searchCoords, setSearchCoords] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [currentView, setCurrentView] = useState('map'); // 'map' or 'settings'
  const [needsPermission, setNeedsPermission] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    const loadedPhotos = await getPhotos();
    setPhotos(loadedPhotos);

    // Check if any photos need permission
    const pending = loadedPhotos.some(p => p.permissionGranted === false);
    setNeedsPermission(pending);
  };

  const handleVerifyPermissions = async () => {
    const updatedPhotos = await Promise.all(photos.map(async (photo) => {
      if (photo.permissionGranted === false) {
        return await verifyPermission(photo);
      }
      return photo;
    }));

    setPhotos(updatedPhotos);
    setNeedsPermission(updatedPhotos.some(p => p.permissionGranted === false));
  };

  const handlePhotosProcessed = async (newPhotos) => {
    for (const photo of newPhotos) {
      await savePhoto(photo);
    }
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleDeletePhoto = async (photo) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      await deletePhoto(photo.id);
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
      if (selectedPhoto && selectedPhoto.id === photo.id) {
        setSelectedPhoto(null);
      }
    }
  };

  const handleLocationSearch = async () => {
    if (!locationSearch.trim()) {
      setSearchCoords(null);
      return;
    }

    setIsGeocoding(true);
    const result = await geocodeLocation(locationSearch);
    setIsGeocoding(false);

    if (result) {
      setSearchCoords(result);
    } else {
      alert(`Could not find location: ${locationSearch}`);
      setSearchCoords(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setAltitudeMin('');
    setAltitudeMax('');
    setLocationSearch('');
    setSearchCoords(null);
    setSearchRadius('10');
  };

  const handleDeleteAll = async () => {
    await deleteAll();
    setPhotos([]);
    setSelectedPhoto(null);
  };

  // Filter photos based on all criteria
  const filteredPhotos = photos.filter(photo => {
    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const fileName = photo.id.toLowerCase();
      const location = `${photo.lat.toFixed(6)} ${photo.lng.toFixed(6)}`;
      const altitude = photo.altitude ? photo.altitude.toString() : '';
      const camera = `${photo.make} ${photo.model}`.toLowerCase();
      const date = photo.date.toLowerCase();
      const locationName = photo.locationName ? photo.locationName.toLowerCase() : '';

      const matchesText = fileName.includes(query) ||
        location.includes(query) ||
        altitude.includes(query) ||
        camera.includes(query) ||
        date.includes(query) ||
        locationName.includes(query);

      if (!matchesText) return false;
    }

    // Altitude range filter
    if (altitudeMin || altitudeMax) {
      const photoAlt = photo.altitude !== 'N/A' ? parseFloat(photo.altitude) : null;
      if (photoAlt === null) return false;

      if (altitudeMin && photoAlt < parseFloat(altitudeMin)) return false;
      if (altitudeMax && photoAlt > parseFloat(altitudeMax)) return false;
    }

    // Location radius filter
    if (searchCoords && searchRadius) {
      const distance = calculateDistance(
        searchCoords.lat,
        searchCoords.lng,
        photo.lat,
        photo.lng
      );

      if (distance > parseFloat(searchRadius)) return false;
    }

    return true;
  });

  return (
    <div className="app-container">
      {needsPermission && (
        <div className="permission-banner">
          <span>⚠️ Some photos need permission to be displayed.</span>
          <button onClick={handleVerifyPermissions} className="verify-btn">
            Verify Permissions
          </button>
        </div>
      )}
      {currentView === 'map' ? (
        <>
          <div className="map-wrapper">
            <Map photos={filteredPhotos} onPhotoSelect={setSelectedPhoto} onDeletePhoto={handleDeletePhoto} />
          </div>
          <div className="controls-overlay">
            <div className="view-toggle">
              <button
                className="view-toggle-btn active"
                onClick={() => setCurrentView('map')}
              >
                🗺️ Map
              </button>
              <button
                className="view-toggle-btn"
                onClick={() => setCurrentView('settings')}
              >
                ⚙️ Settings
              </button>
            </div>

            <h1 className="app-title">Drone Photo Mapper</h1>
            <Uploader onPhotosProcessed={handlePhotosProcessed} />

            <div className="search-container">
              <input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="clear-btn">×</button>
              )}
            </div>

            <button
              className="advanced-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? '▼' : '▶'} Advanced Filters
            </button>

            {showAdvanced && (
              <div className="advanced-filters">
                <div className="filter-group">
                  <label className="filter-label">Altitude (m)</label>
                  <div className="range-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={altitudeMin}
                      onChange={(e) => setAltitudeMin(e.target.value)}
                      className="range-input"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={altitudeMax}
                      onChange={(e) => setAltitudeMax(e.target.value)}
                      className="range-input"
                    />
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Location</label>
                  <div className="location-search">
                    <input
                      type="text"
                      placeholder="City, region, country..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                      className="filter-input"
                    />
                    <button
                      onClick={handleLocationSearch}
                      className="search-location-btn"
                      disabled={isGeocoding}
                    >
                      {isGeocoding ? '...' : '🔍'}
                    </button>
                  </div>
                  {searchCoords && (
                    <div className="location-result">
                      📍 {searchCoords.displayName}
                    </div>
                  )}
                </div>

                <div className="filter-group">
                  <label className="filter-label">Radius (km)</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(e.target.value)}
                    className="filter-input"
                    min="0.1"
                    step="0.1"
                  />
                </div>

                {(searchQuery || altitudeMin || altitudeMax || searchCoords) && (
                  <button onClick={clearFilters} className="clear-all-btn">
                    Clear All Filters
                  </button>
                )}
              </div>
            )}

            <div className="stats">
              {filteredPhotos.length} of {photos.length} photos
            </div>
          </div>
        </>
      ) : (
        <Settings
          photos={photos}
          onDeletePhoto={handleDeletePhoto}
          onDeleteAll={handleDeleteAll}
          onClose={() => setCurrentView('map')}
        />
      )}
      <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} onDelete={() => handleDeletePhoto(selectedPhoto)} />
    </div>
  );
}

export default App;
