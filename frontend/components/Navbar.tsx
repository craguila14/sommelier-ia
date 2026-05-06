'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const isChat = pathname === '/chat';

  return (
    <nav
      style={{ backgroundColor: 'var(--wine-900)', borderBottom: '1px solid var(--wine-700)' }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-2xl">🍷</span>
          <div>
            <span
              className="font-display text-xl font-semibold tracking-wide"
              style={{ color: 'var(--gold-300)' }}
            >
              Cepas
            </span>
            <span
              className="hidden sm:block text-xs tracking-widest uppercase ml-1"
              style={{ color: 'var(--wine-300)' }}
            >
              · Sommelier IA
            </span>
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-sm px-4 py-2 rounded-lg transition-colors"
            style={{
              color: isChat ? 'var(--wine-300)' : 'var(--gold-300)',
              backgroundColor: isChat ? 'transparent' : 'rgba(212,175,90,0.1)',
            }}
          >
            Inicio
          </Link>

          <Link
            href="/chat"
            className="text-sm px-4 py-2 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: isChat ? 'var(--gold-400)' : 'var(--wine-700)',
              color: isChat ? 'var(--wine-950)' : 'var(--gold-300)',
              border: `1px solid ${isChat ? 'var(--gold-400)' : 'var(--wine-600)'}`,
            }}
          >
            {isChat ? '🍷 Hablando con Cepas' : 'Hablar con Cepas →'}
          </Link>
        </div>
      </div>
    </nav>
  );
}