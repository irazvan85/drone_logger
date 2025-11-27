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
            console.log(`Processing photo ${photo.id}. Handle present?`, !!photo.handle, typeof photo.handle);

            // If we have a handle, try to get the file
            if (photo.handle) {
                try {
                    // Check if queryPermission exists
                    if (typeof photo.handle.queryPermission !== 'function') {
                        console.error(`Handle for ${photo.id} does not have queryPermission method.`, photo.handle);
                        return { ...photo, error: true, errorMsg: 'Invalid Handle' };
                    }

                    // Check permission
                    const permission = await photo.handle.queryPermission({ mode: 'read' });
                    console.log(`Photo ${photo.id} permission: ${permission}`);

                    if (permission === 'granted') {
                        try {
                            const file = await photo.handle.getFile();
                            console.log(`Got file for ${photo.id}, size: ${file.size}`);
                            return {
                                ...photo,
                                url: URL.createObjectURL(file),
                                permissionGranted: true
                            };
                        } catch (err) {
                            console.error(`Error getting file for ${photo.id}:`, err);
                            return { ...photo, url: null, error: true, errorMsg: err.message };
                        }
                    } else {
                        console.warn(`Permission needed for ${photo.id}`);
                        // Permission needed
                        return {
                            ...photo,
                            url: null, // No URL yet
                            permissionGranted: false
                        };
                    }
                } catch (err) {
                    console.error(`Error querying permission for ${photo.id}:`, err);
                    return { ...photo, error: true, errorMsg: `Perm Query Error: ${err.message}` };
                }
            } else {
                console.warn(`No handle for ${photo.id}`);
            }
            // Fallback for old data (if any)
            return photo;
        } catch (error) {
            console.error(`Error loading photo ${photo.id}:`, error);
            return { ...photo, error: true, errorMsg: `Load Error: ${error.message}` };
        }
    }));

    return processedPhotos;
}

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
