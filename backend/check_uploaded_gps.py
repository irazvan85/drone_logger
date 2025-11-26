from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
from pathlib import Path

def get_gps_data(image_path):
    """Extract GPS data from image EXIF."""
    try:
        image = Image.open(image_path)
        exif = image._getexif()
        
        if not exif:
            print(f"No EXIF data found in {image_path}")
            return None
            
        gps_data = {}
        for tag_id, value in exif.items():
            tag = TAGS.get(tag_id, tag_id)
            if tag == "GPSInfo":
                for gps_tag_id, gps_value in value.items():
                    gps_tag = GPSTAGS.get(gps_tag_id, gps_tag_id)
                    gps_data[gps_tag] = gps_value
                return gps_data
        
        print(f"No GPS data found in EXIF")
        return None
    except Exception as e:
        print(f"Error reading {image_path}: {e}")
        return None

if __name__ == "__main__":
    photo = Path(r"C:\Users\irazv\.gemini\antigravity\brain\f1743423-0eb4-4549-8a13-c8c2ce941c2b\uploaded_image_1764103736790.jpg")
    
    print(f"Checking: {photo.name}")
    gps = get_gps_data(photo)
    
    if gps:
        print("\n✓ GPS Data Found:")
        for key, value in gps.items():
            print(f"  {key}: {value}")
    else:
        print("\n✗ No GPS data in this photo")
