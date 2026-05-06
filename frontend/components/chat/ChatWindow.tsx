'use client';

import { useChat } from '@/hooks/useChat';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

export function ChatWindow() {
  const { messages, isLoading, error, sendMessage, clearMessages, stopStreaming } = useChat();

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)', backgroundColor: 'var(--cream-100)' }}>

      {/* Header del chat */}
      <div
        className="px-6 py-3 flex items-center justify-between"
        style={{ backgroundColor: 'white', borderBottom: '1px solid var(--cream-300)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-base"
            style={{ backgroundColor: 'var(--wine-800)' }}
          >
            🍷
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--wine-800)' }}>Cepas</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Sommelier virtual · vinos chilenos
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
            style={{ color: 'var(--muted)', backgroundColor: 'var(--cream-200)' }}
          >
            Nueva conversación
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          className="px-4 py-2 text-sm"
          style={{ backgroundColor: '#fef2f2', borderBottom: '1px solid #fecaca', color: '#dc2626' }}
        >
          {error}
        </div>
      )}

      {/* Mensajes */}
      <MessageList messages={messages} onSuggestionClick={sendMessage} />

      {/* Input */}
      <ChatInput onSend={sendMessage} onStop={stopStreaming} isLoading={isLoading} />
    </div>
  );
}