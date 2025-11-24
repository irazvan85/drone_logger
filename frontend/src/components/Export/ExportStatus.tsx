import React from 'react';

interface ExportStatusProps {
  isExporting: boolean;
  isSuccess: boolean;
  error: Error | null;
}

export const ExportStatus: React.FC<ExportStatusProps> = ({ isExporting, isSuccess, error }) => {
  if (isExporting) {
    return <div className="text-blue-600">Exporting data...</div>;
  }
  if (isSuccess) {
    return <div className="text-green-600">Export successful! File downloaded.</div>;
  }
  if (error) {
    return <div className="text-red-600">Error: {error.message}</div>;
  }
  return null;
};
