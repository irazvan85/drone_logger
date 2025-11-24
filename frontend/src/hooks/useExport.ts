import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { download } from '../services/api';
import { ExportRequest } from '../types';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportMutation = useMutation({
    mutationFn: async (request: ExportRequest) => {
      setIsExporting(true);
      try {
        const blob = await download('/exports', request);
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `export.${request.format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        return true;
      } finally {
        setIsExporting(false);
      }
    },
  });

  return {
    exportData: exportMutation.mutate,
    isExporting,
    error: exportMutation.error,
    isSuccess: exportMutation.isSuccess,
    reset: exportMutation.reset
  };
};
