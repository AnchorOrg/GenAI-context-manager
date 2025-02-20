export interface FileContext {
  path: string;
  content: string;
  language?: string;
}

export interface ProjectContext {
  files: FileContext[];
  timestamp: string;
  description?: string;
  customFormat?: string;
}

export interface OutputFormat {
  description: string;
  contextHeader: string;
}