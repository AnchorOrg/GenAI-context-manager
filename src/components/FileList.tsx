import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import type { FileContext } from '../types';

interface FileListProps {
  files: FileContext[];
  onRemoveFile: (index: number) => void;
}

export function FileList({ files, onRemoveFile }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Uploaded Files</h3>
      <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-700">{file.path}</span>
            </div>
            <button
              onClick={() => onRemoveFile(index)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}