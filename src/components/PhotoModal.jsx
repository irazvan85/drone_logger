import React from 'react';

export default function PhotoModal({ photo, onClose, onDelete }) {
    if (!photo) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <div className="image-container">
                    <img src={photo.url} alt="Full size" />
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
