import { useState } from "react";
import { PhotoImport } from "../components/PhotoImport/PhotoImport";
import { PhotoList } from "../components/PhotoList/PhotoList";
import { MapContainer } from "../components/Map/MapContainer";
import { FilterPanel } from "../components/Filters/FilterPanel";
import { ExportDialog } from "../components/Export/ExportDialog";
import { FlightStats } from "../components/FlightStats/FlightStats";
import { useFilters } from "../hooks/useFilters";

export default function Dashboard() {
  const filters = useFilters();
  const [isExportOpen, setIsExportOpen] = useState(false);

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
          // We might need to pass bounds too if backend supports it in export
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
            <h2 className="text-xl font-bold mb-4">Map Visualization</h2>
            <MapContainer photos={filters.hasFiltered ? filters.filteredPhotos : undefined} />
          </section>
        </div>
      </div>

      <section>
        <PhotoList />
      </section>
    </div>
  );
}
