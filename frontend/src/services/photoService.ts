import { get, post, APIResponse } from "./api";

export interface PhotoMetadata {
  latitude: number;
  longitude: number;
  altitude?: number;
  camera_model?: string;
  iso?: number;
  shutter_speed?: string;
  aperture?: string;
}

export interface Photo {
  id: string;
  filename: string;
  file_path: string;
  timestamp: string;
  file_size: number;
  format: string;
  collection_id: string;
  metadata?: PhotoMetadata;
  created_at: string;
  updated_at: string;
}

export interface ImportStats {
  total_scanned: number;
  total_imported: number;
  successful: number;
  failed: number;
  errors: string[];
}

export interface ImportRequest {
  folder_path: string;
  collection_id: string;
}

export const photoService = {
  list: async (collectionId?: string): Promise<Photo[]> => {
    let url = "/photos/";
    if (collectionId) {
      url += `?collection_id=${collectionId}`;
    }
    const response = await get<Photo[]>(url);
    return response.data || [];
  },

  importPhotos: async (data: ImportRequest): Promise<ImportStats> => {
    const response = await post<ImportStats>("/photos/import", data);
    if (!response.data) {
      throw new Error("Failed to import photos");
    }
    return response.data;
  },
};
