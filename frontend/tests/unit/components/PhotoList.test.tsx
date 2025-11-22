import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PhotoList } from "../../../src/components/PhotoList/PhotoList";
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

describe("PhotoList", () => {
  it("renders loading state initially", () => {
    vi.mocked(photoService.list).mockResolvedValue([]);
    vi.mocked(collectionService.getAll).mockResolvedValue([]);
    
    renderWithClient(<PhotoList />);
    expect(screen.getByText("Loading photos...")).toBeInTheDocument();
  });

  it("renders photos when loaded", async () => {
    const mockPhotos = [
      {
        id: "1",
        filename: "test.jpg",
        file_path: "/path/to/test.jpg",
        timestamp: new Date().toISOString(),
        file_size: 1024,
        format: "jpg",
        collection_id: "col1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          latitude: 37.0,
          longitude: -122.0,
        },
      },
    ];

    vi.mocked(photoService.list).mockResolvedValue(mockPhotos);
    vi.mocked(collectionService.getAll).mockResolvedValue([]);

    renderWithClient(<PhotoList />);

    await waitFor(() => {
      expect(screen.getByText("test.jpg")).toBeInTheDocument();
    });
    expect(screen.getByText(/GPS: 37.0000, -122.0000/)).toBeInTheDocument();
  });

  it("renders empty state when no photos", async () => {
    vi.mocked(photoService.list).mockResolvedValue([]);
    vi.mocked(collectionService.getAll).mockResolvedValue([]);

    renderWithClient(<PhotoList />);

    await waitFor(() => {
      expect(screen.getByText("No photos found. Import some photos to get started.")).toBeInTheDocument();
    });
  });
});
