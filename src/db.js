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
    // We need to store the file blob, not the object URL
    // The object URL is transient and revoked on page reload
    // We'll reconstruct it on load
    const { url, ...photoData } = photo;
    return db.put(STORE_NAME, photoData);
}

export async function getPhotos() {
    const db = await dbPromise;
    const photos = await db.getAll(STORE_NAME);
    // Recreate object URLs
    return photos.map(photo => ({
        ...photo,
        url: URL.createObjectURL(photo.file)
    }));
}

export async function deletePhoto(id) {
    const db = await dbPromise;
    return db.delete(STORE_NAME, id);
}

export async function deleteAll() {
    const db = await dbPromise;
    return db.clear(STORE_NAME);
}
