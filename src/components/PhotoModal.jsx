import React, { useState, useEffect, useMemo } from 'react';
import { calculateDistance } from '../geocoding';

export default function PhotoModal({ photo, photos, onSelectPhoto, onClose, onDelete }) {
    const [radius, setRadius] = useState(500); // Default 500m
    const [anchorPhoto, setAnchorPhoto] = useState(null);

    // Set anchor photo when modal opens with a new photo (not during navigation)
    useEffect(() => {
        if (photo && !anchorPhoto) {
            setAnchorPhoto(photo);
        } else if (!photo) {
            setAnchorPhoto(null);
        }
    }, [photo, anchorPhoto]);

    // Filter photos within radius of anchor
    const nearbyPhotos = useMemo(() => {
        if (!anchorPhoto || !photos) return [];
        return photos.filter(p => {
            const dist = calculateDistance(anchorPhoto.lat, anchorPhoto.lng, p.lat, p.lng);
            return dist * 1000 <= radius; // Convert km to m
        });
    }, [anchorPhoto, photos, radius]);

    const currentIndex = nearbyPhotos.findIndex(p => p.id === photo?.id);
    const hasNext = currentIndex < nearbyPhotos.length - 1;
    const hasPrev = currentIndex > 0;

    const handleNext = (e) => {
        e.stopPropagation();
        if (hasNext) onSelectPhoto(nearbyPhotos[currentIndex + 1]);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        if (hasPrev) onSelectPhoto(nearbyPhotos[currentIndex - 1]);
    };

    if (!photo) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="nav-controls">
                        <button
                            className="nav-btn"
                            disabled={!hasPrev}
                            onClick={handlePrev}
                        >
                            &larr; Prev
                        </button>
                        <div className="radius-control">
                            <span className="radius-label">Radius: {radius}m</span>
                            <input
                                type="range"
                                min="100"
                                max="5000"
                                step="100"
                                value={radius}
                                onChange={(e) => setRadius(Number(e.target.value))}
                            />
                            <span className="count-label">
                                {currentIndex + 1} / {nearbyPhotos.length}
                            </span>
                        </div>
                        <button
                            className="nav-btn"
                            disabled={!hasNext}
                            onClick={handleNext}
                        >
                            Next &rarr;
                        </button>
                    </div>
                    <button className="close-btn-header" onClick={onClose}>&times;</button>
                </div>

                <div className="image-container">
                    {photo.url ? (
                        <img src={photo.url} alt="Full size" />
                    ) : (
                        <div className="no-image-placeholder" style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px', textAlign: 'center' }}>
                            <span style={{ fontSize: '3rem' }}>
                                {photo.permissionGranted === false ? '🔒' : '⚠️'}
                            </span>
                            <span>
                                {photo.permissionGranted === false
                                    ? 'Permission needed to view image'
                                    : 'Image not available'}
                            </span>
                            <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '10px', textAlign: 'left' }}>
                                <div>ID: {photo.id}</div>
                                <div>Handle: {photo.handle ? 'Present' : 'Missing'}</div>
                                <div>Handle Type: {typeof photo.handle}</div>
                                <div>Is FileSystemHandle: {photo.handle instanceof FileSystemHandle ? 'Yes' : 'No'}</div>
                                <div>Permission: {photo.permissionGranted === undefined ? 'Undefined' : (photo.permissionGranted ? 'True' : 'False')}</div>
                                <div>Error: {photo.error ? 'Yes' : 'No'}</div>
                                {photo.errorMsg && <div>Msg: {photo.errorMsg}</div>}
                            </div>
                        </div>
                    )}
                </div>
                <div className="info-bar">
                    <div className="info-item">
                        <span className="label">Date:</span>
                        <span className="value">{photo.date}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Camera:</span>
                        <span className="value">{photo.make} {photo.model}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">GPS:</span>
                        <span className="value">{photo.lat.toFixed(6)}, {photo.lng.toFixed(6)}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Altitude:</span>
                        <span className="value">
                            {photo.altitude && photo.altitude !== 'N/A' ? `${photo.altitude} m` : 'N/A'}
                        </span>
                    </div>
                    <div className="info-item">
                        <button
                            onClick={onDelete}
                            style={{
                                padding: '8px 16px',
                                background: '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            Delete Photo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
