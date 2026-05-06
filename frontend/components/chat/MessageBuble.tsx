import { Message } from '@/hooks/useChat';
import { SourceBadge } from '@/components/ui/SourceBadge';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-5`}>

      {/* Avatar sommelier */}
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0 mt-1"
          style={{ backgroundColor: 'var(--wine-800)' }}
        >
          🍷
        </div>
      )}

      <div className={`max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
          style={
            isUser
              ? {
                  backgroundColor: 'var(--wine-800)',
                  color: 'var(--cream-100)',
                  borderBottomRightRadius: '4px',
                }
              : {
                  backgroundColor: 'white',
                  color: 'var(--charcoal)',
                  border: '1px solid var(--cream-300)',
                  borderBottomLeftRadius: '4px',
                }
          }
        >
          <p className="whitespace-pre-wrap">{message.content}</p>

          {/* Cursor parpadeante */}
          {message.isStreaming && (
            <span
              className="cursor-blink inline-block w-1.5 h-4 ml-0.5 rounded-sm"
              style={{ backgroundColor: 'var(--gold-400)' }}
            />
          )}
        </div>

        {/* Fuentes RAG */}
        {!isUser && message.sources && message.sources.length > 0 && !message.isStreaming && (
          <SourceBadge sources={message.sources} />
        )}
      </div>

      {/* Avatar usuario */}
      {isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm ml-3 flex-shrink-0 mt-1 text-xs font-medium"
          style={{ backgroundColor: 'var(--cream-300)', color: 'var(--wine-800)' }}
        >
          tú
        </div>
      )}
    </div>
  );
}