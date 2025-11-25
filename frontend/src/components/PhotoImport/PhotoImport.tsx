import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collectionService } from "../../services/collectionService";
import { photoService, ImportRequest } from "../../services/photoService";

export const PhotoImport: React.FC = () => {
  const [folderPath, setFolderPath] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const queryClient = useQueryClient();

  // Fetch collections for dropdown
  const { data: collections, isLoading: isLoadingCollections } = useQuery({
    queryKey: ["collections"],
    queryFn: collectionService.getAll,
  });

  // Create collection mutation
  const createCollectionMutation = useMutation({
    mutationFn: (name: string) => collectionService.create({ name }),
    onSuccess: (newCollection) => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      setSelectedCollectionId(newCollection.id);
      setIsCreatingCollection(false);
      setNewCollectionName("");
      alert(`Collection "${newCollection.name}" created!`);
    },
    onError: (error: Error) => {
      alert(`Failed to create collection: ${error.message}`);
    },
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

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    // alert(`Creating collection: ${newCollectionName}`); // Debug
    if (!newCollectionName.trim()) {
        alert("Please enter a collection name");
        return;
    }
    createCollectionMutation.mutate(newCollectionName);
  };

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
      
      {/* Collection Selection / Creation */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            {isCreatingCollection ? "New Collection Name" : "Collection"}
          </label>
          <button
            type="button"
            onClick={() => setIsCreatingCollection(!isCreatingCollection)}
            className="text-xs text-indigo-600 hover:text-indigo-800"
          >
            {isCreatingCollection ? "Select Existing" : "Create New"}
          </button>
        </div>

        {isCreatingCollection ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="My Drone Flight"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            />
            <button
              type="button"
              onClick={handleCreateCollection}
              disabled={createCollectionMutation.isPending || !newCollectionName.trim()}
              className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
            >
              {createCollectionMutation.isPending ? "..." : "Create"}
            </button>
          </div>
        ) : (
          <select
            id="collection-select"
            aria-label="Select Collection"
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
        )}
      </div>

      <form onSubmit={handleImport} className="space-y-4">
        {/* Removed duplicate collection select */}

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
