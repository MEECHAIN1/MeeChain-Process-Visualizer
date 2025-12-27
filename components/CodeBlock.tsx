
import React from 'react';
import { TerminalIcon } from './icons';

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden mt-2 border border-gray-700 shadow-lg">
      <div className="flex items-center px-4 py-2 bg-gray-700/50">
        <TerminalIcon className="w-5 h-5 text-green-400" />
        <span className="ml-2 text-xs font-semibold text-gray-300">Code Example</span>
      </div>
      <pre className="p-4 text-xs sm:text-sm text-left overflow-x-auto">
        <code className="font-mono text-cyan-300">{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
