'use client';

import Link from 'next/link';
import { useState } from 'react';
import CreeperFace from '@/components/ui/CreeperFace';

export default function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: 'rgba(18,16,31,0.95)',
        borderBottom: '2px solid',
        borderColor: '#3DAB3D',
        backdropFilter: 'blur(4px)',
        boxShadow: '0 4px 0px 0px rgba(0,0,0,0.5)',
      }}
    >
      <nav className="container-mc flex items-center justify-between h-16">
        {/* Identity */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          <CreeperFace size={36} expression="idle" />
          <div className="flex flex-col">
            <span
              className="heading-pixel text-white"
              style={{ fontSize: '10px', letterSpacing: '0.1em' }}
            >
              CreeperBot
            </span>
            <span
              style={{
                fontFamily: 'var(--font-vt)',
                fontSize: '13px',
                color: 'var(--color-grass-light)',
                lineHeight: 1,
              }}
            >
              FARLANDS 2026
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/#features">FEATURES</NavLink>
          <NavLink href="/#mission">MISSION</NavLink>
          <NavLink href="/#how-it-works">HOW IT WORKS</NavLink>
          <div
            style={{
              width: '1px',
              height: '24px',
              backgroundColor: '#333333',
              margin: '0 8px',
            }}
          />
          <Link href="/sign-in" className="btn btn-ghost btn-sm">
            SIGN IN
          </Link>
          <Link href="/sign-up" className="btn btn-primary btn-sm">
            ENTER WORLD
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden flex flex-col gap-1 p-2 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          style={{
            background: 'none',
            border: '2px solid var(--color-stone-dark)',
          }}
        >
          <span
            style={{
              display: 'block',
              width: '18px',
              height: '2px',
              backgroundColor: menuOpen ? 'var(--color-grass-light)' : '#E8E8E8',
              transition: 'background-color 150ms',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '18px',
              height: '2px',
              backgroundColor: menuOpen ? 'var(--color-grass-light)' : '#E8E8E8',
              transition: 'background-color 150ms',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '18px',
              height: '2px',
              backgroundColor: menuOpen ? 'var(--color-grass-light)' : '#E8E8E8',
              transition: 'background-color 150ms',
            }}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: 'rgba(18,16,31,0.98)',
            borderTop: '1px solid #333333',
            padding: '16px',
          }}
        >
          <div className="flex flex-col gap-2">
            <MobileNavLink href="/#features" onClick={() => setMenuOpen(false)}>
              FEATURES
            </MobileNavLink>
            <MobileNavLink href="/#mission" onClick={() => setMenuOpen(false)}>
              MISSION
            </MobileNavLink>
            <MobileNavLink href="/#how-it-works" onClick={() => setMenuOpen(false)}>
              HOW IT WORKS
            </MobileNavLink>
            <div style={{ height: '1px', backgroundColor: '#333333', margin: '8px 0' }} />
            <Link
              href="/sign-in"
              className="btn btn-ghost"
              onClick={() => setMenuOpen(false)}
            >
              SIGN IN
            </Link>
            <Link
              href="/sign-up"
              className="btn btn-primary"
              onClick={() => setMenuOpen(false)}
            >
              ENTER YOUR WORLD
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: '7px',
        color: '#AAAAAA',
        textDecoration: 'none',
        padding: '6px 10px',
        letterSpacing: '0.08em',
        transition: 'color 150ms',
      }}
      className="hover:text-white"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: '9px',
        color: '#CCCCCC',
        textDecoration: 'none',
        padding: '10px 12px',
        borderLeft: '3px solid var(--color-grass-dark)',
        letterSpacing: '0.08em',
      }}
    >
      {children}
    </Link>
  );
}
