import { create } from 'zustand';

interface MapState {
  center: [number, number];
  zoom: number;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: [51.505, -0.09], // Default center
  zoom: 13,
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
}));
