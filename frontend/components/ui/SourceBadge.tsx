import { Source } from '@/hooks/useChat';

const TOPIC_LABELS: Record<string, string> = {
  cepa: '🍇 Cepa',
  valle: '🗺️ Valle',
  maridaje: '🥩 Maridaje',
  vina: '🏭 Viña',
  glosario: '📖 Glosario',
  servicio: '🍷 Servicio',
  regulacion: '📋 Regulación',
  estadisticas: '📊 Estadísticas',
  historia: '📚 Historia',
  industria: '🏢 Industria',
  educativo: '🎓 Educativo',
};

export function SourceBadge({ sources }: { sources: Source[] }) {
  const uniqueTopics = [...new Set(sources.map((s) => s.topic))];

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      <span className="text-xs mr-1" style={{ color: 'var(--muted)' }}>Fuentes:</span>
      {uniqueTopics.map((topic) => (
        <span
          key={topic}
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: 'rgba(107,26,48,0.07)',
            color: 'var(--wine-700)',
            border: '1px solid rgba(107,26,48,0.12)',
          }}
        >
          {TOPIC_LABELS[topic] ?? topic}
        </span>
      ))}
    </div>
  );
}