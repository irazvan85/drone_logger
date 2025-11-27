// Reverse geocoding using Nominatim API (OpenStreetMap)
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/reverse';

export async function getLocationName(lat, lng) {
    try {
        const response = await fetch(
            `${NOMINATIM_API}?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'DronePhotoMapper/1.0'
                }
            }
        );

        if (!response.ok) {
            console.warn('Geocoding request failed');
            return 'Unknown Location';
        }

        const data = await response.json();

        // Build a readable location name from the address components
        const address = data.address || {};
        const parts = [
            address.city || address.town || address.village,
            address.state || address.region,
            address.country
        ].filter(Boolean);

        return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
    } catch (error) {
        console.error('Geocoding error:', error);
        return 'Unknown Location';
    }
}

// Rate limiting: wait between requests to respect API limits
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Forward geocoding: convert location name to coordinates
export async function geocodeLocation(locationName) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`,
            {
                headers: {
                    'User-Agent': 'DronePhotoMapper/1.0'
                }
            }
        );

        if (!response.ok) {
            console.warn('Forward geocoding request failed');
            return null;
        }

        const data = await response.json();

        if (data.length === 0) {
            return null;
        }

        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            displayName: data[0].display_name
        };
    } catch (error) {
        console.error('Forward geocoding error:', error);
        return null;
    }
}

// Calculate distance between two points using Haversine formula
// Returns distance in kilometers
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
