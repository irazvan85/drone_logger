import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PhotoImport } from "../../../src/components/PhotoImport/PhotoImport";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { photoService } from "../../../src/services/photoService";
import { collectionService } from "../../../src/services/collectionService";

// Mock services
vi.mock("../../../src/services/photoService");
vi.mock("../../../src/services/collectionService");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithClient = (ui: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("PhotoImport", () => {
  it("renders import form", async () => {
    vi.mocked(collectionService.getAll).mockResolvedValue([]);
    renderWithClient(<PhotoImport />);
    
    await waitFor(() => {
      expect(screen.getByText("Import Photos")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("Folder Path")).toBeInTheDocument();
    expect(screen.getByText("Start Import")).toBeInTheDocument();
  });

  it("submits import request", async () => {
    const mockCollections = [
      { id: "col1", name: "Test Collection", created_at: "", updated_at: "", total_photos: 0 },
    ];
    vi.mocked(collectionService.getAll).mockResolvedValue(mockCollections);
    vi.mocked(photoService.importPhotos).mockResolvedValue({
      successful: 5,
      failed: 0,
      total_imported: 5,
      total_scanned: 5,
      errors: [],
    });

    // Mock alert
    window.alert = vi.fn();

    renderWithClient(<PhotoImport />);

    // Wait for collections to load
    await waitFor(() => {
      expect(screen.getByText("Test Collection")).toBeInTheDocument();
    });

    // Fill form
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "col1" } });
    fireEvent.change(screen.getByLabelText("Folder Path"), { target: { value: "/tmp/photos" } });

    // Submit
    fireEvent.click(screen.getByText("Start Import"));

    await waitFor(() => {
      expect(photoService.importPhotos).toHaveBeenCalledWith({
        folder_path: "/tmp/photos",
        collection_id: "col1",
      });
    });
  });
});
