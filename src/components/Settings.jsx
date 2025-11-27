import React from 'react';

export default function Settings({ photos, onDeletePhoto, onDeleteAll, onClose }) {
    const handleDeleteAll = () => {
        if (confirm(`Are you sure you want to delete all ${photos.length} photos? This cannot be undone.`)) {
            onDeleteAll();
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h2>Photo Management</h2>
                <button onClick={onClose} className="close-settings-btn">✕</button>
            </div>

            <div className="settings-content">
                {photos.length === 0 ? (
                    <div className="no-photos">
                        <p>No photos imported yet.</p>
                        <p>Click "Import Drone Photos" to add some.</p>
                    </div>
                ) : (
                    <>
                        <div className="settings-actions">
                            <div className="photo-count">{photos.length} photo{photos.length !== 1 ? 's' : ''}</div>
                            <button onClick={handleDeleteAll} className="delete-all-btn">
                                Delete All Photos
                            </button>
                        </div>

                        <div className="photo-list">
                            {photos.map((photo) => (
                                <div key={photo.id} className="photo-item">
                                    <div className="photo-thumbnail">
                                        <img src={photo.url} alt={photo.id} />
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
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
