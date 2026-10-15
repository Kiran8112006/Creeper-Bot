import type { Metadata } from 'next';
import Link from 'next/link';
import CreeperFace from '@/components/ui/CreeperFace';

export const metadata: Metadata = {
  title: 'Account — CreeperBot',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-cave)',
      }}
    >
      {/* Minimal auth header */}
      <header
        style={{
          borderBottom: '2px solid #222222',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(18,16,31,0.95)',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <CreeperFace size={30} expression="idle" />
          <span
            className="heading-pixel text-white"
            style={{ fontSize: '9px' }}
          >
            CreeperBot
          </span>
        </Link>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '7px',
            color: '#777777',
            textDecoration: 'none',
          }}
        >
          ← BACK TO WORLD
        </Link>
      </header>

      {/* Block texture band */}
      <div className="block-divider" style={{ height: '8px' }} />

      {/* Page content */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        {children}
      </main>

      {/* Footer note */}
      <div
        style={{
          textAlign: 'center',
          padding: '16px',
          borderTop: '1px solid #1A1A1A',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: '#444444',
          }}
        >
          CreeperBot is an independent project, not affiliated with Mojang Studios or Microsoft.
        </p>
      </div>
    </div>
  );
}
