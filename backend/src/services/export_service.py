import csv
import io
from typing import List, Dict, Any
from xml.sax.saxutils import escape

from src.models.photo import Photo


class ExportService:
    def export_to_geojson(self, photos: List[Photo]) -> Dict[str, Any]:
        features = []
        for photo in photos:
            if photo.metadata_:
                coordinates = [photo.metadata_.longitude, photo.metadata_.latitude]
                if photo.metadata_.altitude is not None:
                    coordinates.append(photo.metadata_.altitude)

                feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": coordinates
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
                    photo.metadata_.altitude if photo.metadata_.altitude is not None else "",
                    photo.timestamp.isoformat() if photo.timestamp else ""
                ])

        return output.getvalue()

    def export_to_kml(self, photos: List[Photo]) -> str:
        kml_header = """<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
"""
        kml_footer = """  </Document>
</kml>"""

        placemarks = ""
        for photo in photos:
            if photo.metadata_:
                # Altitude is optional in KML coordinate tuples
                coords = f"{photo.metadata_.longitude},{photo.metadata_.latitude}"
                if photo.metadata_.altitude is not None:
                    coords += f",{photo.metadata_.altitude}"

                placemarks += f"""    <Placemark>
      <name>{escape(photo.filename)}</name>
      <Point>
        <coordinates>{coords}</coordinates>
      </Point>
    </Placemark>
"""
        return kml_header + placemarks + kml_footer
