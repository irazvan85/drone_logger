export interface Photo {
  id: string
  filename: string
  file_path: string
  timestamp: string
  file_size: number
  format: string
  collection_id: string
  metadata_id?: string
}

export interface PhotoMetadata {
  id: string
  latitude: number
  longitude: number
  altitude?: number
  camera_model?: string
  iso?: number
  shutter_speed?: string
  aperture?: string
  photo_id: string
}

export interface GPSLocation {
  id: string
  latitude: number
  longitude: number
  altitude?: number
  uncertainty_radius?: number
}

export interface Flight {
  id: string
  name: string
  start_time: string
  end_time: string
  total_distance: number
  max_altitude?: number
  avg_altitude?: number
  waypoints: GPSLocation[]
  collection_id: string
}

export interface Collection {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
  total_photos: number
}

export interface PhotoMarker {
  id: string
  location_id: string
  photos_count: number
  is_clustered: boolean
  visible: boolean
}

export interface ImportResult {
  total_scanned: number
  total_imported: number
  successful: number
  failed: number
  errors: string[]
}
