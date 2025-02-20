import React, { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { FileList } from './components/FileList';
import { getFileLanguage, formatContextOutput, estimateTokenCount, downloadAsFile } from './utils/fileHelpers';
import type { FileContext, ProjectContext, OutputFormat } from './types';
import { Copy, Download, Settings } from 'lucide-react';

function App() {
  const [files, setFiles] = useState<FileContext[]>([]);
  const [copied, setCopied] = useState(false);
  const [tokenLimit, setTokenLimit] = useState(4000);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>({
    description: '',
    contextHeader: ''
  });
  const [showSettings, setShowSettings] = useState(false);

  const handleFilesSelected = (newFiles: FileContext[]) => {
    const processedFiles = newFiles.map(file => ({
      ...file,
      language: getFileLanguage(file.path)
    }));
    setFiles(prev => [...prev, ...processedFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const context: ProjectContext = {
    files,
    timestamp: new Date().toISOString()
  };

  const formattedContext = formatContextOutput(context, outputFormat);
  const estimatedTokens = estimateTokenCount(formattedContext);

  const handleCopyOrDownload = async () => {
    if (estimatedTokens > tokenLimit) {
      downloadAsFile(formattedContext, 'context.md');
    } else {
      try {
        await navigator.clipboard.writeText(formattedContext);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                GPT Context Creator
              </h1>
              <p className="text-gray-600">
                Upload your project files to generate a context that GPT can understand.
              </p>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {showSettings && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Token Limit
                  </label>
                  <input
                    type="number"
                    value={tokenLimit}
                    onChange={(e) => setTokenLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description Template
                  </label>
                  <textarea
                    value={outputFormat.description}
                    onChange={(e) => setOutputFormat(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Enter your project description template..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Context Header
                  </label>
                  <textarea
                    value={outputFormat.contextHeader}
                    onChange={(e) => setOutputFormat(prev => ({ ...prev, contextHeader: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Enter your context header template..."
                  />
                </div>
              </div>
            </div>
          )}
          
          <FileUploader onFilesSelected={handleFilesSelected} />
          <FileList files={files} onRemoveFile={handleRemoveFile} />
        </div>

        {files.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Generated Context
                </h2>
                <p className="text-sm text-gray-500">
                  Estimated tokens: {estimatedTokens} 
                  {estimatedTokens > tokenLimit && 
                    <span className="text-amber-600 ml-2">
                      (Exceeds limit - will download as file)
                    </span>
                  }
                </p>
              </div>
              <button
                onClick={handleCopyOrDownload}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {estimatedTokens > tokenLimit ? (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </>
                )}
              </button>
            </div>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
              {formattedContext}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;