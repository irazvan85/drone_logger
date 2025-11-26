import React from 'react';
import { useMap } from 'react-leaflet';

interface MapControlsProps {
    onFullscreen?: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({ onFullscreen }) => {
    const map = useMap();

    const handleZoomIn = () => {
        map.zoomIn();
    };

    const handleZoomOut = () => {
        map.zoomOut();
    };

    const handleFullscreen = () => {
        if (onFullscreen) {
            onFullscreen();
        } else {
            // Default fullscreen behavior
            const mapContainer = map.getContainer();
            if (!document.fullscreenElement) {
                mapContainer.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div className="map-controls">
            {/* Zoom Controls */}
            <div className="zoom-controls">
                <button
                    onClick={handleZoomIn}
                    className="map-control-button zoom-in"
                    title="Zoom in"
                    aria-label="Zoom in"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18">
                        <path d="M9 4v10M4 9h10" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                </button>
                <div className="zoom-divider"></div>
                <button
                    onClick={handleZoomOut}
                    className="map-control-button zoom-out"
                    title="Zoom out"
                    aria-label="Zoom out"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18">
                        <path d="M4 9h10" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                </button>
            </div>

            {/* Fullscreen Control */}
            <div className="fullscreen-control">
                <button
                    onClick={handleFullscreen}
                    className="map-control-button"
                    title="Toggle fullscreen"
                    aria-label="Toggle fullscreen"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18">
                        <path d="M2 6V2h4M16 6V2h-4M2 12v4h4M16 12v4h-4" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
