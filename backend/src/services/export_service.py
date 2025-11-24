import json
import csv
import io
from typing import List, Dict, Any
from src.models.photo import Photo

class ExportService:
    def export_to_geojson(self, photos: List[Photo]) -> Dict[str, Any]:
        features = []
        for photo in photos:
            if photo.metadata_:
                feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            photo.metadata_.longitude,
                            photo.metadata_.latitude,
                            photo.metadata_.altitude
                        ]
                    },
                    "properties": {
                        "id": photo.id,
                        "filename": photo.filename,
                        "timestamp": photo.timestamp.isoformat() if photo.timestamp else None
                    }
                }
                features.append(feature)
        
        return {
            "type": "FeatureCollection",
            "features": features
        }

    def export_to_csv(self, photos: List[Photo]) -> str:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["filename", "latitude", "longitude", "altitude", "timestamp"])
        
        for photo in photos:
            if photo.metadata_:
                writer.writerow([
                    photo.filename,
                    photo.metadata_.latitude,
                    photo.metadata_.longitude,
                    photo.metadata_.altitude,
                    photo.timestamp.isoformat() if photo.timestamp else ""
                ])
        
        return output.getvalue()

    def export_to_kml(self, photos: List[Photo]) -> str:
        # Simple KML generation without external library for now to keep it lightweight
        # or use simple string formatting.
        kml_header = """<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
"""
        kml_footer = """  </Document>
</kml>"""
        
        placemarks = ""
        for photo in photos:
            if photo.metadata_:
                placemarks += f"""    <Placemark>
      <name>{photo.filename}</name>
      <Point>
        <coordinates>{photo.metadata_.longitude},{photo.metadata_.latitude},{photo.metadata_.altitude}</coordinates>
      </Point>
    </Placemark>
"""
        return kml_header + placemarks + kml_footer
