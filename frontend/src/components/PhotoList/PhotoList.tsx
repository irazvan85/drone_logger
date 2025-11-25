import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { photoService } from "../../services/photoService";
import { collectionService } from "../../services/collectionService";

import { Photo } from "../../types";

interface PhotoListProps {
  photos?: Photo[];
}

export const PhotoList: React.FC<PhotoListProps> = ({ photos: externalPhotos }) => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");

  // Fetch collections for filter
  const { data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: collectionService.getAll,
    enabled: !externalPhotos, // Only fetch if no external photos provided
  });

  // Fetch photos if not provided externally
  const { data: fetchedPhotos, isLoading, error } = useQuery({
    queryKey: ["photos", selectedCollectionId],
    queryFn: () => photoService.list(selectedCollectionId || undefined),
    enabled: !externalPhotos,
  });

  const photos = externalPhotos || fetchedPhotos;

  if (isLoading && !externalPhotos) return <div>Loading photos...</div>;
  if (error && !externalPhotos) return <div>Error loading photos: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Photos</h2>
        {!externalPhotos && (
          <select
            value={selectedCollectionId}
            onChange={(e) => setSelectedCollectionId(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          >
            <option value="">All Collections</option>
            {collections?.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos?.map((photo) => (
          <div key={photo.id} className="border rounded-lg overflow-hidden shadow-sm bg-white">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {/* Placeholder for image thumbnail - real app would serve images */}
              <span className="text-gray-500">Image Preview</span>
            </div>
            <div className="p-3">
              <p className="font-medium truncate" title={photo.filename}>
                {photo.filename}
              </p>
              <div className="text-xs text-gray-500 mt-1 space-y-1">
                <p>Size: {(photo.file_size / 1024 / 1024).toFixed(2)} MB</p>
                <p>Date: {new Date(photo.timestamp).toLocaleDateString()}</p>
                {photo.metadata && (
                  <p>
                    GPS: {photo.metadata.latitude.toFixed(4)}, {photo.metadata.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {photos?.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No photos found. Import some photos to get started.
          </div>
        )}
      </div>
    </div>
  );
};
