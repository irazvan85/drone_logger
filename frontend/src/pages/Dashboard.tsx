import { PhotoImport } from "../components/PhotoImport/PhotoImport";
import { PhotoList } from "../components/PhotoList/PhotoList";
import { MapContainer } from "../components/Map/MapContainer";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Drone Photo GPS Visualizer</h1>
        <p className="text-gray-600 mt-2">Manage and visualize your drone flight photos.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <section>
            <PhotoImport />
          </section>
        </div>
        
        <div className="lg:col-span-2">
           <section className="h-full">
            <h2 className="text-xl font-bold mb-4">Map Visualization</h2>
            <MapContainer />
          </section>
        </div>
      </div>

      <section>
        <PhotoList />
      </section>
    </div>
  );
}
