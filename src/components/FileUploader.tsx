import React, { useCallback } from 'react';
import { FileText, Upload } from 'lucide-react';
import type { FileContext } from '../types';

interface FileUploaderProps {
  onFilesSelected: (files: FileContext[]) => void;
}

export function FileUploader({ onFilesSelected }: FileUploaderProps) {
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const fileContexts: FileContext[] = [];
    
    for (const file of fileList) {
      const content = await file.text();
      fileContexts.push({
        path: file.name,
        content,
        language: file.name.split('.').pop()
      });
    }
    
    onFilesSelected(fileContexts);
  }, [onFilesSelected]);

  return (
    <div className="w-full">
      <label 
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-10 h-10 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">Any text-based files</p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          multiple
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}