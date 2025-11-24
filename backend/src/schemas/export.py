from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class ExportRequest(BaseModel):
    format: str
    photo_ids: Optional[List[str]] = None
    date_start: Optional[datetime] = None
    date_end: Optional[datetime] = None
    # We might want to support bounding box here too, but let's start simple or match filter schema

class ExportResponse(BaseModel):
    filename: str
    content_type: str
    data: str  # Or bytes, but for JSON/CSV/KML string is fine usually. 
               # Actually, for file download, we might return a stream, 
               # but the service might return the content or a path.
               # Let's assume the service returns the content string/bytes.
