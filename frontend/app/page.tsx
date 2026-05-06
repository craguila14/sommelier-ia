
import Link from 'next/link';

const HOW_IT_WORKS = [
  {
    number: '01',
    title: 'Haces tu pregunta',
    description: 'Preguntas sobre maridajes, cepas, valles chilenos, recomendaciones por precio o cualquier duda sobre vinos.',
  },
  {
    number: '02',
    title: 'El RAG busca contexto',
    description: 'El sistema genera un embedding de tu pregunta y busca los fragmentos más relevantes en la base de datos vectorial.',
  },
  {
    number: '03',
    title: 'El sommelier responde',
    description: 'GPT-4o mini recibe el contexto recuperado y genera una respuesta precisa, citando las fuentes utilizadas.',
  },
];

const FEATURES = [
  {
    icon: '🧠',
    title: 'RAG con embeddings',
    description: 'Pipeline completo de Retrieval-Augmented Generation con text-embedding-3-large y búsqueda semántica en Pinecone.',
  },
  {
    icon: '🍷',
    title: 'Corpus especializado',
    description: '1.030 vectores sobre vinos chilenos: cepas, valles, maridajes, viñas y documentos oficiales del SAG y Wines of Chile.',
  },
  {
    icon: '⚡',
    title: 'Streaming token a token',
    description: 'Las respuestas aparecen en tiempo real via Server-Sent Events, igual que ChatGPT. Sin esperar a que termine de generar.',
  },
  {
    icon: '📚',
    title: 'Fuentes transparentes',
    description: 'Cada respuesta muestra qué tipo de fuente usó el RAG: cepa, valle, maridaje, regulación o documento oficial.',
  },
  {
    icon: '💬',
    title: 'Conversación multi-turno',
    description: 'El historial de la conversación se incluye en cada request para que el sommelier recuerde el contexto de la charla.',
  },
  {
    icon: '🏗️',
    title: 'Monorepo NestJS + Next.js',
    description: 'Backend NestJS con módulos desacoplados y frontend Next.js 14 con App Router, todo en un solo repositorio.',
  },
];

const STACK = [
  { name: 'Next.js 14', role: 'Frontend · App Router' },
  { name: 'NestJS', role: 'Backend · API REST' },
  { name: 'LangChain', role: 'Orquestación RAG' },
  { name: 'Pinecone', role: 'Base de datos vectorial' },
  { name: 'OpenAI', role: 'Embeddings + LLM' },
  { name: 'GPT-4o mini', role: 'Generación de respuestas' },
];

export default function HomePage() {
  return (
    <main style={{ backgroundColor: 'var(--cream-100)' }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, var(--wine-950) 0%, var(--wine-800) 60%, var(--wine-700) 100%)`,
          minHeight: '88vh',
        }}
      >
        {/* Textura decorativa */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, var(--gold-300) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--wine-400) 0%, transparent 40%)',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-24 text-center">

          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-8"
            style={{
              backgroundColor: 'rgba(212,175,90,0.15)',
              border: '1px solid var(--gold-600)',
              color: 'var(--gold-300)',
            }}
          >
            <span>🇨🇱</span> Proyecto de portafolio · RAG + IA
          </div>

          {/* Título */}
          <h1
            className="font-display animate-fade-up-delay-1 text-6xl sm:text-7xl md:text-8xl font-light leading-tight mb-6"
            style={{ color: 'var(--cream-100)' }}
          >
            El sommelier<br />
            <em style={{ color: 'var(--gold-300)' }}>que siempre</em><br />
            está disponible
          </h1>

          {/* Subtítulo */}
          <p
            className="animate-fade-up-delay-2 text-lg sm:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ color: 'var(--wine-200)' }}
          >
            Pregunta sobre maridajes, cepas chilenas, valles vitivinícolas y
            recomendaciones por precio. Responde con RAG sobre un corpus de
            1.030 vectores especializados en vinos chilenos.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/chat"
              className="px-8 py-4 rounded-xl font-medium text-base transition-all hover:scale-105 hover:shadow-2xl"
              style={{
                backgroundColor: 'var(--gold-400)',
                color: 'var(--wine-950)',
              }}
            >
              🍷 Hablar con Cepas
            </Link>
            <a
              href="https://github.com/craguila14/sommelier-ia"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl font-medium text-base transition-all hover:scale-105"
              style={{
                border: '1px solid var(--wine-500)',
                color: 'var(--wine-200)',
                backgroundColor: 'rgba(255,255,255,0.05)',
              }}
            >
              Ver código →
            </a>
          </div>
        </div>

        {/* Ola decorativa */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 20C480 40 240 0 0 30L0 60Z"
              fill="var(--cream-100)" />
          </svg>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold-500)' }}>
            El pipeline RAG
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light" style={{ color: 'var(--wine-800)' }}>
            Cómo funciona
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.number} className="relative">
              {/* Número decorativo */}
              <div
                className="font-display text-7xl font-light mb-4 leading-none"
                style={{ color: 'var(--cream-300)' }}
              >
                {step.number}
              </div>
              <h3
                className="font-display text-xl font-semibold mb-3"
                style={{ color: 'var(--wine-800)' }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEMO VISUAL ──────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--wine-950)' }} className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs tracking-widest uppercase text-center mb-12" style={{ color: 'var(--gold-400)' }}>
            Ejemplo de conversación
          </p>

          {/* Mock chat */}
          <div
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: 'var(--wine-900)', border: '1px solid var(--wine-700)' }}
          >
            {/* Chat header */}
            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{ borderBottom: '1px solid var(--wine-800)' }}
            >
              <span className="text-xl">🍷</span>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--gold-300)' }}>Cepas</p>
                <p className="text-xs" style={{ color: 'var(--wine-400)' }}>Sommelier virtual · en línea</p>
              </div>
            </div>

            {/* Mensajes */}
            <div className="p-6 space-y-5">
              {/* Usuario */}
              <div className="flex justify-end">
                <div
                  className="px-4 py-3 rounded-2xl rounded-br-sm text-sm max-w-xs"
                  style={{ backgroundColor: 'var(--wine-700)', color: 'var(--cream-100)' }}
                >
                  ¿Qué vino chileno va bien con un asado de tira?
                </div>
              </div>

              {/* Sommelier */}
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  style={{ backgroundColor: 'var(--wine-700)' }}
                >
                  🍷
                </div>
                <div
                  className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm max-w-sm leading-relaxed"
                  style={{ backgroundColor: 'var(--wine-800)', color: 'var(--cream-200)' }}
                >
                  Para un asado de tira te recomiendo un{' '}
                  <strong style={{ color: 'var(--gold-300)' }}>Cabernet Sauvignon del Valle del Maipo</strong>
                  {' '}— los taninos firmes complementan perfectamente la grasa del vacuno y el ahumado de la parrilla. 🍷
                  <div className="flex flex-wrap gap-1 mt-3">
                    {['🥩 Maridaje', '🗺️ Valle', '🍇 Cepa'].map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(212,175,90,0.15)', color: 'var(--gold-400)' }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES TÉCNICAS ────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold-500)' }}>
            Detalles de implementación
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light" style={{ color: 'var(--wine-800)' }}>
            Lo que hace interesante<br />este proyecto
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{
                backgroundColor: 'white',
                border: '1px solid var(--cream-300)',
              }}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3
                className="font-semibold text-base mb-2"
                style={{ color: 'var(--wine-800)' }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STACK ────────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: 'var(--cream-200)', borderTop: '1px solid var(--cream-300)', borderBottom: '1px solid var(--cream-300)' }}
        className="py-16"
      >
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs tracking-widest uppercase text-center mb-10" style={{ color: 'var(--gold-500)' }}>
            Stack tecnológico
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {STACK.map((s) => (
              <div
                key={s.name}
                className="px-5 py-3 rounded-xl text-center"
                style={{ backgroundColor: 'white', border: '1px solid var(--cream-300)' }}
              >
                <p className="font-semibold text-sm" style={{ color: 'var(--wine-800)' }}>{s.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2
          className="font-display text-4xl sm:text-5xl font-light mb-6"
          style={{ color: 'var(--wine-800)' }}
        >
          ¿Qué vino llevas<br />
          <em style={{ color: 'var(--gold-500)' }}>al próximo asado?</em>
        </h2>
        <p className="text-base mb-10" style={{ color: 'var(--muted)' }}>
          Pregúntale a Cepas — responde en segundos con recomendaciones basadas en corpus especializado.
        </p>
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-medium text-base transition-all hover:scale-105 hover:shadow-xl"
          style={{ backgroundColor: 'var(--wine-800)', color: 'var(--gold-300)' }}
        >
          🍷 Hablar con Cepas
        </Link>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer
        style={{ borderTop: '1px solid var(--cream-300)', color: 'var(--muted)' }}
        className="py-8 text-center text-sm"
      >
        Construido por{' '}
        <a
          href="https://github.com/craguila14"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--wine-600)' }}
          className="hover:underline"
        >
          Constanza Águila
        </a>
        {' '}· Proyecto de portafolio ·{' '}
        <a
          href="https://github.com/craguila14/sommelier-ia"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--wine-600)' }}
          className="hover:underline"
        >
          GitHub
        </a>
      </footer>
    </main>
  );
}