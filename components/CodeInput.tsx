import React from 'react';

interface CodeInputProps {
  code: string;
  setCode: (code: string) => void;
  isLoading: boolean;
}

const CodeInput: React.FC<CodeInputProps> = ({ code, setCode, isLoading }) => {
  return (
    <div className="flex flex-col flex-grow">
      <label htmlFor="codeInput" className="mb-2 text-sm font-medium text-zinc-400">
        Paste your code below
      </label>
      <textarea
        id="codeInput"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        disabled={isLoading}
        placeholder="function helloWorld() { console.log('Hello, World!'); }"
        className="w-full flex-grow p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 min-h-0"
        aria-label="Code Input"
      />
    </div>
  );
};

export default CodeInput;
