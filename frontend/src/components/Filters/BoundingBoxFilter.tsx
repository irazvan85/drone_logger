import React from 'react';

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface BoundingBoxFilterProps {
  bounds: Bounds | null;
  isDrawing: boolean;
  onToggleDrawing: () => void;
  onClearBounds: () => void;
}

export const BoundingBoxFilter: React.FC<BoundingBoxFilterProps> = ({
  bounds,
  isDrawing,
  onToggleDrawing,
  onClearBounds,
}) => {
  return (
    <div className="bounding-box-filter p-4 bg-white rounded shadow mb-4">
      <h3 className="text-lg font-semibold mb-2">Geographic Area</h3>
      <div className="flex flex-col gap-2">
        <button
          onClick={onToggleDrawing}
          className={`px-4 py-2 rounded ${
            isDrawing
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isDrawing ? 'Cancel Drawing' : 'Draw Bounding Box'}
        </button>
        
        {bounds && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Selected Area: <br />
              N: {bounds.north.toFixed(4)}, S: {bounds.south.toFixed(4)} <br />
              E: {bounds.east.toFixed(4)}, W: {bounds.west.toFixed(4)}
            </p>
            <button
              onClick={onClearBounds}
              className="mt-2 text-sm text-red-500 hover:text-red-700 underline"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
