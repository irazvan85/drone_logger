import React from 'react';
import { Virtuoso } from 'react-virtuoso';

export default function Settings({ photos, onDeletePhoto, onDeleteAll, onClose }) {
    const handleDeleteAll = () => {
        if (confirm(`Are you sure you want to delete all ${photos.length} photos? This cannot be undone.`)) {
            onDeleteAll();
        }
    };

    const getTotalSize = () => {
        const totalBytes = photos.reduce((acc, photo) => acc + (photo.size || 0), 0);
        if (totalBytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(totalBytes) / Math.log(k));
        return parseFloat((totalBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const Row = (index) => {
        const photo = photos[index];
        return (
            <div style={{ paddingBottom: '15px', boxSizing: 'border-box', height: '180px' }}>
                <div className="photo-item" style={{ height: '100%' }}>
                    <div className="photo-thumbnail">
                        {photo.url ? (
                            <img src={photo.url} alt={photo.id} />
                        ) : (
                            <div className="no-image-placeholder">
                                {photo.permissionGranted === false ? '🔒' : '📷'}
                            </div>
                        )}
                    </div>
                    <div className="photo-details">
                        <div className="photo-name">{photo.id.substring(0, photo.id.lastIndexOf('.'))}</div>
                        <div className="photo-info">
                            <div className="info-row">
                                <span className="info-label">Location:</span>
                                <span className="info-value">{photo.locationName || 'Unknown'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">GPS:</span>
                                <span className="info-value">{photo.lat.toFixed(4)}, {photo.lng.toFixed(4)}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Altitude:</span>
                                <span className="info-value">
                                    {photo.altitude && photo.altitude !== 'N/A' ? `${photo.altitude} m` : 'N/A'}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Date:</span>
                                <span className="info-value">{photo.date}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Camera:</span>
                                <span className="info-value">{photo.make} {photo.model}</span>
                            </div>
                            {photo.permissionGranted === false && (
                                <div className="permission-warning">
                                    ⚠️ Permission needed to view image
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => onDeletePhoto(photo)}
                        className="delete-photo-btn"
                        title="Delete this photo"
                    >
                        🗑️
                    </button>
                </div>
            </div>
        );
    };

    const getHighestAltitude = () => {
        if (!photos || photos.length === 0) return null;
        let maxAltPhoto = null;
        let maxAlt = -Infinity;

        photos.forEach(photo => {
            const alt = parseFloat(photo.altitude);
            if (!isNaN(alt) && alt > maxAlt) {
                maxAlt = alt;
                maxAltPhoto = photo;
            }
        });

        return maxAltPhoto;
    };

    const highestAltitudePhoto = getHighestAltitude();

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h2>Photo Management</h2>
                <button onClick={onClose} className="close-settings-btn">✕</button>
            </div>

            <div className="settings-content" style={{ display: 'flex', flexDirection: 'column' }}>
                {photos.length === 0 ? (
                    <div className="no-photos">
                        <p>No photos imported yet.</p>
                        <p>Click "Import Drone Photos" to add some.</p>
                    </div>
                ) : (
                    <>
                        <div className="settings-actions">
                            <div className="photo-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Total Photos:</span>
                                    <span className="stat-value">{photos.length}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Total Size:</span>
                                    <span className="stat-value">{getTotalSize()}</span>
                                </div>
                                {highestAltitudePhoto && (
                                    <div className="stat-item highlight">
                                        <div className="stat-content">
                                            <span className="stat-label">Highest Altitude:</span>
                                            <span className="stat-value">
                                                {highestAltitudePhoto.altitude} m
                                                <span className="stat-sub">
                                                    ({highestAltitudePhoto.locationName || `${highestAltitudePhoto.lat.toFixed(4)}, ${highestAltitudePhoto.lng.toFixed(4)}`})
                                                </span>
                                            </span>
                                        </div>
                                        {highestAltitudePhoto.url && (
                                            <div className="stat-thumbnail">
                                                <img src={highestAltitudePhoto.url} alt="Highest Altitude" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <button onClick={handleDeleteAll} className="delete-all-btn">
                                Delete All Photos
                            </button>
                        </div>

                        <div className="photo-list" style={{ flex: 1, height: '100%' }}>
                            <Virtuoso
                                style={{ height: '100%' }}
                                totalCount={photos.length}
                                itemContent={Row}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
