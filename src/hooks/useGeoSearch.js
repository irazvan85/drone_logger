import { useState, useCallback } from 'react';
import { geocodeLocation, calculateDistance } from '../geocoding';

export function useGeoSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    const [searchRadius, setSearchRadius] = useState('10');
    const [searchCoords, setSearchCoords] = useState(null);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [altitudeMin, setAltitudeMin] = useState('');
    const [altitudeMax, setAltitudeMax] = useState('');

    const handleLocationSearch = useCallback(async () => {
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
    }, [locationSearch]);

    const clearFilters = useCallback(() => {
        setSearchQuery('');
        setAltitudeMin('');
        setAltitudeMax('');
        setLocationSearch('');
        setSearchCoords(null);
        setSearchRadius('10');
    }, []);

    const filterPhotos = useCallback((photos) => {
        return photos.filter(photo => {
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
    }, [searchQuery, altitudeMin, altitudeMax, searchCoords, searchRadius]);

    return {
        searchQuery, setSearchQuery,
        locationSearch, setLocationSearch,
        searchRadius, setSearchRadius,
        searchCoords, setSearchCoords,
        isGeocoding,
        altitudeMin, setAltitudeMin,
        altitudeMax, setAltitudeMax,
        handleLocationSearch,
        clearFilters,
        filterPhotos
    };
}
