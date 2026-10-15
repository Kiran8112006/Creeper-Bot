import Link from 'next/link';
import CreeperFace from '@/components/ui/CreeperFace';

export default function SiteFooter() {
  return (
    <footer>
      {/* Block row divider */}
      <div className="block-divider" />
      <div className="block-divider-dirt" />

      <div
        style={{
          backgroundColor: 'var(--color-cave)',
          borderTop: '2px solid #333333',
          padding: '48px 0 24px',
        }}
      >
        <div className="container-mc">
          <div
            className="grid gap-8"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
          >
            {/* Identity */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CreeperFace size={32} expression="idle" />
                <span
                  className="heading-pixel text-white"
                  style={{ fontSize: '9px' }}
                >
                  CreeperBot
                </span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: '#888888',
                  lineHeight: 1.7,
                  maxWidth: '240px',
                }}
              >
                A Minecraft-inspired physical robot and desktop pet. Built for FARLANDS 2026.
              </p>
              <div
                className="badge badge-warning mt-4"
                style={{ display: 'inline-flex' }}
              >
                <span>⚠</span>
                <span>PROTOTYPE — IN DEVELOPMENT</span>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3
                className="heading-pixel"
                style={{ fontSize: '7px', color: '#AAAAAA', marginBottom: '16px' }}
              >
                EXPLORE
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <FooterLink href="/#features">Features</FooterLink>
                <FooterLink href="/#mission">TNT Mission</FooterLink>
                <FooterLink href="/#how-it-works">How It Works</FooterLink>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h3
                className="heading-pixel"
                style={{ fontSize: '7px', color: '#AAAAAA', marginBottom: '16px' }}
              >
                ACCOUNT
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <FooterLink href="/sign-up">Create Account</FooterLink>
                <FooterLink href="/sign-in">Sign In</FooterLink>
                <FooterLink href="/dashboard">Dashboard</FooterLink>
              </ul>
            </div>

            {/* Project */}
            <div>
              <h3
                className="heading-pixel"
                style={{ fontSize: '7px', color: '#AAAAAA', marginBottom: '16px' }}
              >
                PROJECT
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    color: '#666666',
                  }}
                >
                  FARLANDS 2026 Entry
                </li>
                <li
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    color: '#666666',
                  }}
                >
                  Hardware: ESP32 + ESP32-CAM
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: '1px solid #2A2A2A',
              marginTop: '40px',
              paddingTop: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '6px',
                color: '#555555',
                letterSpacing: '0.08em',
              }}
            >
              © 2026 CREEPERBOT PROJECT. ALL RIGHTS RESERVED.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: '#444444',
              }}
            >
              CreeperBot is an independent project. Not affiliated with Mojang Studios or Microsoft.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: '#AAAAAA',
          textDecoration: 'none',
          transition: 'color 150ms',
        }}
        className="hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}
