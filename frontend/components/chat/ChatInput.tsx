'use client';

import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, onStop, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="px-4 py-4"
      style={{ backgroundColor: 'white', borderTop: '1px solid var(--cream-300)' }}
    >
      <div className="flex items-end gap-3 max-w-7xl mx-auto">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pregúntame sobre vinos chilenos..."
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none rounded-xl px-4 py-3 text-sm transition-all outline-none"
          style={{
            backgroundColor: 'var(--cream-100)',
            border: '1px solid var(--cream-300)',
            color: 'var(--charcoal)',          // ← texto negro
            maxHeight: '120px',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--wine-400)';
            e.target.style.boxShadow = '0 0 0 3px rgba(107,26,48,0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--cream-300)';
            e.target.style.boxShadow = 'none';
          }}
        />

        {isLoading ? (
          <button
            onClick={onStop}
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
            style={{ backgroundColor: '#ef4444' }}
            title="Detener"
          >
            <StopIcon />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--wine-800)' }}
            title="Enviar"
          >
            <SendIcon />
          </button>
        )}
      </div>
      <p className="text-center text-xs mt-2" style={{ color: 'var(--cream-300)' }}>
        Enter para enviar · Shift+Enter para nueva línea
      </p>
    </div>
  );
}

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
      <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
    </svg>
  );
}