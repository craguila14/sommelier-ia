'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/hooks/useChat';
import { MessageBubble } from './MessageBuble';

const SUGGESTIONS = [
  '¿Qué vino va con un asado de tira?',
  '¿Cuál es la diferencia entre Carménère y Cabernet?',
  'Recomiéndame un vino bajo $8.000',
  '¿Qué caracteriza al Valle de Casablanca?',
];

interface MessageListProps {
  messages: Message[];
  onSuggestionClick: (s: string) => void;
}

export function MessageList({ messages, onSuggestionClick }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-5xl mb-5">🍷</div>
        <h2
          className="font-display text-2xl font-semibold mb-2"
          style={{ color: 'var(--wine-800)' }}
        >
          Hola, soy Cepas
        </h2>
        <p className="text-sm mb-8 max-w-sm" style={{ color: 'var(--muted)' }}>
          Tu sommelier virtual experto en vinos chilenos. Pregúntame sobre
          cepas, maridajes, valles o recomendaciones por precio.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestionClick(s)}
              className="text-left px-4 py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{
                backgroundColor: 'white',
                border: '1px solid var(--cream-300)',
                color: 'var(--charcoal)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 max-w-7xl w-full mx-auto">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}