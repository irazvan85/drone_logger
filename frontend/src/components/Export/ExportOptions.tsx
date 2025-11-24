import React from 'react';

interface ExportOptionsProps {
  format: "geojson" | "csv" | "kml";
  setFormat: (format: "geojson" | "csv" | "kml") => void;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ format, setFormat }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Format</h3>
      <div className="flex space-x-4">
        {(['geojson', 'csv', 'kml'] as const).map((f) => (
          <label key={f} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="format"
              value={f}
              checked={format === f}
              onChange={() => setFormat(f)}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="uppercase">{f}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
