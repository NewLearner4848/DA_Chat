import React, { useState } from 'react';

interface CodeBlockProps {
    code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="bg-zinc-900/70 rounded-md relative group">
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 px-2 py-1 text-xs bg-zinc-700 text-zinc-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
            <pre className="p-4 overflow-x-auto">
                <code className="font-mono text-sm text-zinc-200">{code}</code>
            </pre>
        </div>
    );
};

export default CodeBlock;
