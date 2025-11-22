import { get, post, APIResponse } from "./api";

export interface Collection {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  total_photos: number;
}

export interface CreateCollectionRequest {
  name: string;
  description?: string;
}

export const collectionService = {
  getAll: async (): Promise<Collection[]> => {
    const response = await get<Collection[]>("/collections/");
    return response.data || [];
  },

  getById: async (id: string): Promise<Collection> => {
    const response = await get<Collection>(`/collections/${id}`);
    if (!response.data) {
      throw new Error("Collection not found");
    }
    return response.data;
  },

  create: async (data: CreateCollectionRequest): Promise<Collection> => {
    const response = await post<Collection>("/collections/", data);
    if (!response.data) {
      throw new Error("Failed to create collection");
    }
    return response.data;
  },
};
