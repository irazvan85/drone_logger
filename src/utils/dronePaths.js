import { calculateDistance } from '../geocoding';

/**
 * Groups photos into flight paths based on time and distance constraints.
 * A path is a sequence of photos where:
 * 1. All photos in the path are within a 30-minute window of the first photo in the path.
 * 2. All photos in the path are within a 6km radius of the first photo in the path.
 * 
 * @param {Array} photos - List of photo objects
 * @returns {Array} Array of paths, where each path is an array of [lat, lng] coordinates
 */
export function calculateDronePaths(photos) {
    if (!photos || photos.length === 0) return [];

    // Filter out photos without valid GPS or date
    const validPhotos = photos.filter(p =>
        p.lat != null && p.lng != null && p.date
    );

    // Sort by timestamp
    const sortedPhotos = [...validPhotos].sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const paths = [];
    let currentPath = [];
    let pathStartTime = null;
    let pathStartLocation = null;

    const MAX_TIME_DIFF_MS = 30 * 60 * 1000; // 30 minutes
    const MAX_DIST_KM = 6; // 6 km

    for (const photo of sortedPhotos) {
        const photoTime = new Date(photo.date).getTime();

        // Start a new path if:
        // 1. No current path
        // 2. Time diff > 30 mins from start
        // 3. Distance > 6km from start

        let shouldStartNewPath = false;

        if (currentPath.length === 0) {
            shouldStartNewPath = true;
        } else {
            const timeDiff = photoTime - pathStartTime;
            if (timeDiff > MAX_TIME_DIFF_MS) {
                shouldStartNewPath = true;
            } else {
                const dist = calculateDistance(
                    pathStartLocation.lat, pathStartLocation.lng,
                    photo.lat, photo.lng
                );
                if (dist > MAX_DIST_KM) {
                    shouldStartNewPath = true;
                }
            }
        }

        if (shouldStartNewPath) {
            if (currentPath.length > 1) {
                paths.push(currentPath);
            }
            currentPath = [[photo.lat, photo.lng]];
            pathStartTime = photoTime;
            pathStartLocation = { lat: photo.lat, lng: photo.lng };
        } else {
            currentPath.push([photo.lat, photo.lng]);
        }
    }

    // Add the last path if valid
    if (currentPath.length > 1) {
        paths.push(currentPath);
    }

    return paths;
}
