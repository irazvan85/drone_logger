import React, { useState } from 'react';
import React, { useState } from 'react';
import exifr from 'exifr';
import { getLocationName, delay } from '../geocoding';

export default function Uploader({ onPhotosProcessed }) {
    const [loading, setLoading] = useState(false);

    const handleImport = async () => {
        try {
            // Check if File System Access API is supported
            if (!('showOpenFilePicker' in window)) {
                alert('Your browser does not support the File System Access API. Please use Chrome, Edge, or Opera.');
                return;
            }

            const handles = await window.showOpenFilePicker({
                multiple: true,
                types: [{
                    description: 'Images',
                    accept: {
                        'image/*': ['.jpg', '.jpeg', '.png', '.tiff', '.webp']
                    }
                }]
            });

            if (handles.length === 0) return;

            setLoading(true);
            const processedPhotos = [];

            for (let i = 0; i < handles.length; i++) {
                const handle = handles[i];
                try {
                    const file = await handle.getFile();
                    const exifData = await exifr.parse(file);

                    if (exifData && exifData.latitude && exifData.longitude) {
                        // Extract altitude
                        let altitude = 'N/A';
                        if (exifData.GPSAltitude !== undefined && exifData.GPSAltitude !== null) {
                            altitude = Number(exifData.GPSAltitude).toFixed(2);
                        } else if (exifData.altitude !== undefined && exifData.altitude !== null) {
                            altitude = Number(exifData.altitude).toFixed(2);
                        }

                        // Get location name
                        const locationName = await getLocationName(exifData.latitude, exifData.longitude);

                        // Rate limiting
                        if (i < handles.length - 1) {
                            await delay(1000);
                        }

                        processedPhotos.push({
                            id: file.name + '-' + Date.now(), // Ensure unique ID
                            handle: handle, // Store the file handle
                            lat: exifData.latitude,
                            lng: exifData.longitude,
                            altitude: altitude,
                            locationName: locationName,
                            make: exifData.Make || 'Unknown',
                            model: exifData.Model || 'Unknown',
                            date: exifData.DateTimeOriginal ? new Date(exifData.DateTimeOriginal).toLocaleString() : 'Unknown Date',
                            size: file.size // Store size for stats
                        });
                    } else {
                        console.warn(`No GPS data found for ${file.name}`);
                    }
                } catch (error) {
                    console.error(`Error processing ${handle.name}:`, error);
                }
            }

            onPhotosProcessed(processedPhotos);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error importing photos:', error);
                alert('Failed to import photos. See console for details.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="uploader-container">
            <button onClick={handleImport} className="upload-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Import Drone Photos'}
            </button>
        </div>
    );
}
