import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../../contexts/ThemeContext';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
  readOnly?: boolean;
}

const languageMap: { [key: string]: string } = {
  cpp: 'cpp',
  java: 'java',
  python: 'python',
  javascript: 'javascript',
  c: 'c'
};

export default function CodeEditor({ 
  value, 
  onChange, 
  language, 
  height = '400px',
  readOnly = false 
}: CodeEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={languageMap[language] || language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly,
          automaticLayout: true,
          wordWrap: 'on',
          tabSize: 2,
          insertSpaces: true,
        }}
      />
    </div>
  );
}