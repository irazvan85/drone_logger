import { openDB } from 'idb';

const DB_NAME = 'drone-photo-mapper';
const STORE_NAME = 'photos';

const dbPromise = openDB(DB_NAME, 1, {
    upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    },
});

export async function savePhoto(photo) {
    const db = await dbPromise;
    // Store the photo data including the file handle
    // We do NOT store the file blob or ObjectURL
    const { url, ...photoData } = photo;
    return db.put(STORE_NAME, photoData);
}

export async function getPhotos() {
    const db = await dbPromise;
    const photos = await db.getAll(STORE_NAME);

    // Process photos to verify permissions and create ObjectURLs
    const processedPhotos = await Promise.all(photos.map(async (photo) => {
        try {
            // If we have a handle, try to get the file
            if (photo.handle) {
                // Check permission
                const permission = await photo.handle.queryPermission({ mode: 'read' });

                if (permission === 'granted') {
                    const file = await photo.handle.getFile();
                    return {
                        ...photo,
                        url: URL.createObjectURL(file),
                        permissionGranted: true
                    };
                } else {
                    // Permission needed
                    return {
                        ...photo,
                        url: null, // No URL yet
                        permissionGranted: false
                    };
                }
            }
            // Fallback for old data (if any)
            return photo;
        } catch (error) {
            console.error(`Error loading photo ${photo.id}:`, error);
            return { ...photo, error: true };
        }
    }));

    return processedPhotos;
}

// Helper to request permission for a specific photo
export async function verifyPermission(photo) {
    if (!photo.handle) return false;

    try {
        const permission = await photo.handle.requestPermission({ mode: 'read' });
        if (permission === 'granted') {
            const file = await photo.handle.getFile();
            return {
                ...photo,
                url: URL.createObjectURL(file),
                permissionGranted: true
            };
        }
    } catch (error) {
        console.error('Permission request failed:', error);
    }
    return photo;
}

export async function deletePhoto(id) {
    const db = await dbPromise;
    return db.delete(STORE_NAME, id);
}

export async function deleteAll() {
    const db = await dbPromise;
    return db.clear(STORE_NAME);
}
