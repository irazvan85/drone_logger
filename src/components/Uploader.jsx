import React, { useState } from 'react';
import exifr from 'exifr';
import { getLocationName, delay } from '../geocoding';

export default function Uploader({ onPhotosProcessed }) {
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        setLoading(true);
        const processedPhotos = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const exifData = await exifr.parse(file);
                if (exifData && exifData.latitude && exifData.longitude) {
                    const url = URL.createObjectURL(file);
                    // Extract altitude - check multiple possible fields
                    let altitude = 'N/A';
                    if (exifData.GPSAltitude !== undefined && exifData.GPSAltitude !== null) {
                        altitude = Number(exifData.GPSAltitude).toFixed(2);
                    } else if (exifData.altitude !== undefined && exifData.altitude !== null) {
                        altitude = Number(exifData.altitude).toFixed(2);
                    }

                    // Get location name via reverse geocoding
                    const locationName = await getLocationName(exifData.latitude, exifData.longitude);

                    // Rate limiting: wait 1 second between geocoding requests
                    if (i < files.length - 1) {
                        await delay(1000);
                    }

                    processedPhotos.push({
                        id: file.name + Date.now(),
                        url,
                        lat: exifData.latitude,
                        lng: exifData.longitude,
                        altitude: altitude,
                        locationName: locationName,
                        make: exifData.Make || 'Unknown',
                        model: exifData.Model || 'Unknown',
                        date: exifData.DateTimeOriginal ? new Date(exifData.DateTimeOriginal).toLocaleString() : 'Unknown Date',
                        file
                    });
                } else {
                    console.warn(`No GPS data found for ${file.name}`);
                }
            } catch (error) {
                console.error(`Error processing ${file.name}:`, error);
            }
        }

        onPhotosProcessed(processedPhotos);
        setLoading(false);
    };

    return (
        <div className="uploader-container">
            <label htmlFor="file-upload" className="upload-btn">
                {loading ? 'Processing...' : 'Import Drone Photos'}
            </label>
            <input
                id="file-upload"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/tiff,image/webp"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
}
