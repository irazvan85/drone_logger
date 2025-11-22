"""GPS extraction service for processing photo metadata."""
import logging
from pathlib import Path
from typing import Optional, Tuple, Dict, Any

import piexif
from PIL import Image

from src.exceptions import InvalidGPSData
from src.models.photo import PhotoMetadata

logger = logging.getLogger(__name__)


class GPSExtractor:
    """Service for extracting GPS metadata from images."""

    def extract(self, file_path: Path) -> PhotoMetadata:
        """Extract GPS metadata from an image file.

        Args:
            file_path: Path to the image file

        Returns:
            PhotoMetadata object with extracted data

        Raises:
            InvalidGPSData: If GPS data is missing or invalid
        """
        try:
            exif_dict = piexif.load(str(file_path))
        except Exception as e:
            logger.warning(f"Failed to load EXIF data from {file_path}: {e}")
            raise InvalidGPSData(f"Could not load EXIF data: {e}")

        if "GPS" not in exif_dict or not exif_dict["GPS"]:
            raise InvalidGPSData(f"No GPS data found in {file_path.name}")

        gps_data = exif_dict["GPS"]
        
        try:
            latitude = self._convert_to_degrees(gps_data.get(piexif.GPSIFD.GPSLatitude))
            latitude_ref = gps_data.get(piexif.GPSIFD.GPSLatitudeRef)
            longitude = self._convert_to_degrees(gps_data.get(piexif.GPSIFD.GPSLongitude))
            longitude_ref = gps_data.get(piexif.GPSIFD.GPSLongitudeRef)
            
            if latitude is None or longitude is None:
                raise InvalidGPSData("Incomplete GPS coordinates")

            # Validate coordinates range
            if not (-90 <= latitude <= 90):
                raise InvalidGPSData(f"Invalid latitude: {latitude}")
            if not (-180 <= longitude <= 180):
                raise InvalidGPSData(f"Invalid longitude: {longitude}")

            if latitude_ref == b'S':
                latitude = -latitude
            if longitude_ref == b'W':
                longitude = -longitude

            altitude = self._convert_to_float(gps_data.get(piexif.GPSIFD.GPSAltitude))
            altitude_ref = gps_data.get(piexif.GPSIFD.GPSAltitudeRef)
            if altitude is not None and altitude_ref == 1:
                altitude = -altitude

            # Extract camera info if available
            camera_model = None
            if "0th" in exif_dict and piexif.ImageIFD.Model in exif_dict["0th"]:
                try:
                    camera_model = exif_dict["0th"][piexif.ImageIFD.Model].decode('utf-8').strip()
                except:
                    pass

            # Extract exposure info if available
            iso = None
            shutter_speed = None
            aperture = None
            
            if "Exif" in exif_dict:
                exif = exif_dict["Exif"]
                if piexif.ExifIFD.ISOSpeedRatings in exif:
                    iso = exif[piexif.ExifIFD.ISOSpeedRatings]
                
                # These are complex to decode properly, simplified for now
                # TODO: Implement proper decoding for shutter speed and aperture

            return PhotoMetadata(
                latitude=latitude,
                longitude=longitude,
                altitude=altitude,
                camera_model=camera_model,
                iso=iso,
                shutter_speed=shutter_speed,
                aperture=aperture
            )

        except Exception as e:
            if isinstance(e, InvalidGPSData):
                raise
            logger.error(f"Error parsing GPS data for {file_path}: {e}")
            raise InvalidGPSData(f"Failed to parse GPS data: {e}")

    def _convert_to_degrees(self, value: Tuple[Tuple[int, int], Tuple[int, int], Tuple[int, int]]) -> Optional[float]:
        """Convert GPS coordinates to decimal degrees."""
        if not value:
            return None
        
        d = value[0][0] / value[0][1]
        m = value[1][0] / value[1][1]
        s = value[2][0] / value[2][1]

        return d + (m / 60.0) + (s / 3600.0)

    def _convert_to_float(self, value: Tuple[int, int]) -> Optional[float]:
        """Convert rational number tuple to float."""
        if not value or value[1] == 0:
            return None
        return value[0] / value[1]
