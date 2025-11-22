import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collectionService } from "../../services/collectionService";
import { photoService, ImportRequest } from "../../services/photoService";

export const PhotoImport: React.FC = () => {
  const [folderPath, setFolderPath] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const queryClient = useQueryClient();

  // Fetch collections for dropdown
  const { data: collections, isLoading: isLoadingCollections } = useQuery({
    queryKey: ["collections"],
    queryFn: collectionService.getAll,
  });

  // Import mutation
  const importMutation = useMutation({
    mutationFn: (data: ImportRequest) => photoService.importPhotos(data),
    onSuccess: (data) => {
      alert(`Imported ${data.successful} photos successfully!`);
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: (error: Error) => {
      alert(`Import failed: ${error.message}`);
    },
  });

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderPath || !selectedCollectionId) {
      alert("Please select a collection and enter a folder path.");
      return;
    }

    importMutation.mutate({
      folder_path: folderPath,
      collection_id: selectedCollectionId,
    });
  };

  if (isLoadingCollections) return <div>Loading collections...</div>;

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4">Import Photos</h2>
      <form onSubmit={handleImport} className="space-y-4">
        <div>
          <label htmlFor="collection-select" className="block text-sm font-medium text-gray-700">Collection</label>
          <select
            id="collection-select"
            value={selectedCollectionId}
            onChange={(e) => setSelectedCollectionId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            required
          >
            <option value="">Select a collection</option>
            {collections?.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="folder-path-input" className="block text-sm font-medium text-gray-700">Folder Path</label>
          <input
            id="folder-path-input"
            type="text"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            placeholder="C:\Photos\DroneFlight1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the absolute path to the folder containing photos on the server.
          </p>
        </div>

        <button
          type="submit"
          disabled={importMutation.isPending}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {importMutation.isPending ? "Importing..." : "Start Import"}
        </button>

        {importMutation.isError && (
          <div className="text-red-600 text-sm mt-2">
            Error: {importMutation.error.message}
          </div>
        )}
      </form>
    </div>
  );
};
