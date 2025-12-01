import React from 'react';

export default function FilterControls({
    searchQuery, setSearchQuery,
    showAdvanced, setShowAdvanced,
    altitudeMin, setAltitudeMin,
    altitudeMax, setAltitudeMax,
    locationSearch, setLocationSearch,
    handleLocationSearch,
    searchRadius, setSearchRadius,
    searchCoords,
    isGeocoding,
    clearFilters,
    filteredCount,
    totalCount,
    showPaths,
    setShowPaths
}) {
    return (
        <>
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

                    <div className="filter-group">
                        <label className="filter-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={showPaths}
                                onChange={(e) => setShowPaths(e.target.checked)}
                            />
                            Show Drone Paths
                        </label>
                    </div>

                    {(searchQuery || altitudeMin || altitudeMax || searchCoords) && (
                        <button onClick={clearFilters} className="clear-all-btn">
                            Clear All Filters
                        </button>
                    )}
                </div>
            )}

            <div className="stats">
                {filteredCount} of {totalCount} photos
            </div>
        </>
    );
}
