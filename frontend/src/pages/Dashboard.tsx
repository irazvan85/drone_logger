import { useState } from "react";
import { PhotoImport } from "../components/PhotoImport/PhotoImport";
import { PhotoList } from "../components/PhotoList/PhotoList";
import { MapContainer } from "../components/Map/MapContainer";
import { FilterPanel } from "../components/Filters/FilterPanel";
import { ExportDialog } from "../components/Export/ExportDialog";
import { FlightStats } from "../components/FlightStats/FlightStats";
import { useFilters } from "../hooks/useFilters";

import { ViewToggle } from "../components/Common/ViewToggle";

export default function Dashboard() {
  const filters = useFilters();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Drone Photo GPS Visualizer</h1>
          <p className="text-gray-600 mt-2">Manage and visualize your drone flight photos.</p>
        </div>
        <button
          onClick={() => setIsExportOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export Data
        </button>
      </header>

      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        filterCriteria={{
          date_start: filters.filters.dateStart ? new Date(filters.filters.dateStart).toISOString() : undefined,
          date_end: filters.filters.dateEnd ? new Date(filters.filters.dateEnd).toISOString() : undefined,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <section>
            <PhotoImport />
          </section>
          <section className="h-[500px]">
            <FilterPanel filters={filters} />
          </section>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <FlightStats filters={filters.filters} />
          <section className="h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Visualization</h2>
              <ViewToggle viewMode={viewMode} onChange={setViewMode} />
            </div>

            {viewMode === "map" ? (
              <MapContainer photos={filters.hasFiltered ? filters.filteredPhotos : undefined} />
            ) : (
              <PhotoList photos={filters.filteredPhotos} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
