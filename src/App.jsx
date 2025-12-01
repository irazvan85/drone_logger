import './App.css';
import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import Uploader from './components/Uploader';
import PhotoModal from './components/PhotoModal';
import Settings from './components/Settings';
import FilterControls from './components/FilterControls';
import { usePhotoLibrary } from './hooks/usePhotoLibrary';
import { useGeoSearch } from './hooks/useGeoSearch';
import { calculateDronePaths } from './utils/dronePaths';

function App() {
  const {
    photos,
    needsPermission,
    verifyPermissions,
    addPhotos,
    removePhoto,
    removeAllPhotos
  } = usePhotoLibrary();

  const {
    searchQuery, setSearchQuery,
    locationSearch, setLocationSearch,
    searchRadius, setSearchRadius,
    searchCoords,
    isGeocoding,
    altitudeMin, setAltitudeMin,
    altitudeMax, setAltitudeMax,
    handleLocationSearch,
    clearFilters,
    filterPhotos
  } = useGeoSearch();

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentView, setCurrentView] = useState('map'); // 'map' or 'settings'

  const handleDeletePhoto = async (photo) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      await removePhoto(photo.id);
      if (selectedPhoto && selectedPhoto.id === photo.id) {
        setSelectedPhoto(null);
      }
    }
  };

  const handleDeleteAll = async () => {
    await removeAllPhotos();
    setSelectedPhoto(null);
  };

  const filteredPhotos = React.useMemo(() => {
    return filterPhotos(photos);
  }, [photos, filterPhotos]);

  const [showPaths, setShowPaths] = useState(false);

  const dronePaths = React.useMemo(() => {
    if (!showPaths) return [];
    // Calculate paths based on ALL photos to show complete flight history,
    // or use filteredPhotos if you only want to see paths for currently visible photos.
    // Using filteredPhotos makes more sense for "drilling down" into specific dates/locations.
    return calculateDronePaths(filteredPhotos);
  }, [filteredPhotos, showPaths]);

  return (
    <div className="app-container">
      {needsPermission && (
        <div className="permission-banner">
          <span>⚠️ Some photos need permission to be displayed.</span>
          <button onClick={verifyPermissions} className="verify-btn">
            Verify Permissions
          </button>
        </div>
      )}
      {currentView === 'map' ? (
        <>
          <div className="map-wrapper">
            <Map
              photos={filteredPhotos}
              onPhotoSelect={setSelectedPhoto}
              onDeletePhoto={handleDeletePhoto}
              dronePaths={dronePaths}
              showPaths={showPaths}
            />
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
            <Uploader onPhotosProcessed={addPhotos} />

            <FilterControls
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              showAdvanced={showAdvanced}
              setShowAdvanced={setShowAdvanced}
              altitudeMin={altitudeMin}
              setAltitudeMin={setAltitudeMin}
              altitudeMax={altitudeMax}
              setAltitudeMax={setAltitudeMax}
              locationSearch={locationSearch}
              setLocationSearch={setLocationSearch}
              handleLocationSearch={handleLocationSearch}
              searchRadius={searchRadius}
              setSearchRadius={setSearchRadius}
              searchCoords={searchCoords}
              isGeocoding={isGeocoding}
              clearFilters={clearFilters}
              filteredCount={filteredPhotos.length}
              totalCount={photos.length}
              showPaths={showPaths}
              setShowPaths={setShowPaths}
            />
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
      <PhotoModal
        photo={selectedPhoto}
        photos={filteredPhotos}
        onSelectPhoto={setSelectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onDelete={() => handleDeletePhoto(selectedPhoto)}
      />
    </div>
  );
}

export default App;
