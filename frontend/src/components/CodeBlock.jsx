import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ghcolors } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

export default function CodeBlock({ code, language = 'python', showLineNumbers = true }) {
  const [copied, setCopied] = useState(false);
  if (!code) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <div className="flex items-center justify-between border-b border-line bg-paper-sunk px-4 py-2">
        <span className="font-mono text-xs text-ink-soft">{language}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs font-medium text-ink-soft hover:text-ink">
          {copied ? <><Check className="h-3.5 w-3.5 text-fix" />Copied</> : <><Copy className="h-3.5 w-3.5" />Copy code</>}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={ghcolors}
        showLineNumbers={showLineNumbers}
        customStyle={{ margin: 0, padding: '1rem', background: '#fff', fontSize: '0.85rem', border: 0, fontFamily: '"JetBrains Mono", monospace' }}
        lineNumberStyle={{ color: '#8089A0', fontSize: '0.72rem', minWidth: '2.2em' }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
