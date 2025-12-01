import React, { useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function LocateControl() {
    const map = useMap();
    const [loading, setLoading] = useState(false);

    const handleLocate = (e) => {
        e.stopPropagation(); // Prevent map click
        setLoading(true);

        map.locate({
            setView: true,
            maxZoom: 16,
            enableHighAccuracy: true
        })
            .on('locationfound', function (e) {
                setLoading(false);
                // Add a temporary marker or circle to show location
                const radius = e.accuracy;
                L.circle(e.latlng, radius).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
                L.circleMarker(e.latlng, {
                    radius: 8,
                    fillColor: "#3388ff",
                    color: "#fff",
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(map);
            })
            .on('locationerror', function (e) {
                setLoading(false);
                alert(e.message);
            });
    };

    return (
        <div className="leaflet-bottom leaflet-left">
            <div className="leaflet-control leaflet-bar">
                <a
                    href="#"
                    role="button"
                    title="Locate me"
                    onClick={handleLocate}
                    style={{
                        width: '30px',
                        height: '30px',
                        lineHeight: '30px',
                        textAlign: 'center',
                        textDecoration: 'none',
                        color: 'black',
                        display: 'block',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? '⏳' : '📍'}
                </a>
            </div>
        </div>
    );
}
