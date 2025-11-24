import React, { useState } from 'react';
import { ExportOptions } from './ExportOptions';
import { ExportStatus } from './ExportStatus';
import { useExport } from '../../hooks/useExport';
import { ExportRequest } from '../../types';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filterCriteria?: Partial<ExportRequest>; // To pass current filters
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose, filterCriteria }) => {
  const [format, setFormat] = useState<"geojson" | "csv" | "kml">("geojson");
  const { exportData, isExporting, isSuccess, error, reset } = useExport();

  if (!isOpen) return null;

  const handleExport = () => {
    exportData({
      format,
      ...filterCriteria
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4">Export Data</h2>
        
        <ExportOptions format={format} setFormat={setFormat} />
        
        <div className="mt-4">
          <ExportStatus isExporting={isExporting} isSuccess={isSuccess} error={error as Error} />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={isExporting}
          >
            Close
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isExporting}
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};
