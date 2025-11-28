import { useState, useEffect } from 'react';
import { savePhoto, getPhotos, deletePhoto, deleteAll, verifyPermission } from '../db';

export function usePhotoLibrary() {
    const [photos, setPhotos] = useState([]);
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

    const verifyPermissions = async () => {
        const updatedPhotos = await Promise.all(photos.map(async (photo) => {
            if (photo.permissionGranted === false) {
                return await verifyPermission(photo);
            }
            return photo;
        }));

        setPhotos(updatedPhotos);
        setNeedsPermission(updatedPhotos.some(p => p.permissionGranted === false));
    };

    const addPhotos = async (newPhotos) => {
        for (const photo of newPhotos) {
            await savePhoto(photo);
        }
        setPhotos((prev) => [...prev, ...newPhotos]);
    };

    const removePhoto = async (photoId) => {
        await deletePhoto(photoId);
        setPhotos(prev => prev.filter(p => p.id !== photoId));
    };

    const removeAllPhotos = async () => {
        await deleteAll();
        setPhotos([]);
    };

    return {
        photos,
        needsPermission,
        verifyPermissions,
        addPhotos,
        removePhoto,
        removeAllPhotos
    };
}
