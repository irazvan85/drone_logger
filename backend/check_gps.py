from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
import sys
from pathlib import Path

def get_gps_data(image_path):
    """Extract GPS data from image EXIF."""
    try:
        image = Image.open(image_path)
        exif = image._getexif()
        
        if not exif:
            return None
            
        gps_data = {}
        for tag_id, value in exif.items():
            tag = TAGS.get(tag_id, tag_id)
            if tag == "GPSInfo":
                for gps_tag_id, gps_value in value.items():
                    gps_tag = GPSTAGS.get(gps_tag_id, gps_tag_id)
                    gps_data[gps_tag] = gps_value
                return gps_data
        return None
    except Exception as e:
        print(f"Error reading {image_path}: {e}")
        return None

if __name__ == "__main__":
    folder = Path(r"D:\TestPhotos")
    photos = list(folder.glob("*.JPG")) + list(folder.glob("*.jpg"))
    
    print(f"Found {len(photos)} photos in {folder}")
    
    gps_count = 0
    for photo in photos[:5]:  # Check first 5
        gps = get_gps_data(photo)
        if gps:
            print(f"✓ {photo.name} has GPS: {list(gps.keys())}")
            gps_count += 1
        else:
            print(f"✗ {photo.name} NO GPS")
    
    print(f"\nTotal with GPS: {gps_count}/{min(5, len(photos))} checked")
