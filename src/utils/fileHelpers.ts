export const getFileLanguage = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    'js': 'JavaScript',
    'jsx': 'JavaScript (React)',
    'ts': 'TypeScript',
    'tsx': 'TypeScript (React)',
    'py': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'cs': 'C#',
    'go': 'Go',
    'rs': 'Rust',
    'php': 'PHP',
    'rb': 'Ruby',
    'swift': 'Swift',
    'kt': 'Kotlin',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'json': 'JSON',
    'md': 'Markdown',
    'yml': 'YAML',
    'yaml': 'YAML',
    'xml': 'XML',
    'sql': 'SQL',
  };

  return languageMap[extension || ''] || 'Plain Text';
};

export const formatContextOutput = (
  context: ProjectContext,
  format: OutputFormat
): string => {
  let output = '';
  
  // Add description if provided
  if (format.description) {
    output += '# Description\n\n';
    output += `${format.description}\n\n`;
  }
  
  // Add context header
  output += '# Context\n\n';
  if (format.contextHeader) {
    output += `${format.contextHeader}\n\n`;
  }
  
  output += 'The following is a list of all project files and their complete contents:\n\n';
  
  context.files.forEach(file => {
    output += `${file.path}:\n\`\`\`${file.language?.toLowerCase() || ''}\n${file.content}\n\`\`\`\n\n`;
  });
  
  return output;
};

export const estimateTokenCount = (text: string): number => {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
};

export const downloadAsFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};