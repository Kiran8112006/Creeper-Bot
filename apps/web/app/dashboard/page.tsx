import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CreeperFace from '@/components/ui/CreeperFace';
import { signOut } from './actions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — CreeperBot',
  description: 'Your CreeperBot control centre.',
};

// Nav item for the sidebar
function NavSlot({
  label,
  icon,
  available = false,
  active = false,
}: {
  label: string;
  icon: React.ReactNode;
  available?: boolean;
  active?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: active
          ? 'rgba(93,138,48,0.15)'
          : 'transparent',
        borderLeft: active
          ? '3px solid var(--color-grass)'
          : '3px solid transparent',
        cursor: available ? 'pointer' : 'not-allowed',
        opacity: available || active ? 1 : 0.45,
        transition: 'background-color 150ms',
      }}
    >
      <div
        className="slot"
        style={{ width: '32px', height: '32px', flexShrink: 0 }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '7px',
            color: active ? 'var(--color-grass-light)' : '#AAAAAA',
            letterSpacing: '0.08em',
          }}
        >
          {label}
        </div>
        {!available && (
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              color: '#555555',
              marginTop: '2px',
            }}
          >
            Not yet available
          </div>
        )}
      </div>
    </div>
  );
}

function StatusCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block-panel" style={{ padding: '20px' }}>
      <div
        style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '7px',
          color: '#777777',
          letterSpacing: '0.1em',
          marginBottom: '12px',
          borderBottom: '1px solid #333333',
          paddingBottom: '8px',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

export default async function DashboardPage() {
  // Server-side session validation
  const supabase = await createClient();

  if (!supabase) {
    // Supabase not configured — still show a dashboard shell explaining the issue
    return <DashboardShell userEmail={null} notConfigured />;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Middleware should have already redirected unauthenticated users,
  // but double-check server-side for defence in depth.
  if (error || !user) {
    redirect('/sign-in');
  }

  return <DashboardShell userEmail={user.email ?? null} />;
}

function DashboardShell({
  userEmail,
  notConfigured = false,
}: {
  userEmail: string | null;
  notConfigured?: boolean;
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-cave)',
      }}
    >
      {/* Top bar */}
      <header
        style={{
          backgroundColor: 'rgba(18,16,31,0.97)',
          borderBottom: '2px solid var(--color-grass-dark)',
          padding: '0 24px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 4px 0 rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CreeperFace size={28} expression="idle" />
          <span
            className="heading-pixel"
            style={{ fontSize: '8px', color: '#E8E8E8' }}
          >
            CreeperBot
          </span>
          <div
            style={{
              width: '1px',
              height: '20px',
              backgroundColor: '#333333',
              marginLeft: '4px',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '7px',
              color: '#777777',
              letterSpacing: '0.08em',
            }}
          >
            CONTROL CENTRE
          </span>
        </div>

        {/* Account menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {userEmail && (
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: '#777777',
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {userEmail}
            </span>
          )}
          {!notConfigured && (
            <form action={signOut}>
              <button
                id="dashboard-signout-btn"
                type="submit"
                className="btn btn-secondary btn-sm"
              >
                SIGN OUT
              </button>
            </form>
          )}
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside
          style={{
            width: '220px',
            flexShrink: 0,
            borderRight: '2px solid #222222',
            backgroundColor: 'var(--color-cave-mid)',
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '16px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '6px',
              color: '#444444',
              padding: '0 16px 12px',
              letterSpacing: '0.1em',
            }}
          >
            NAVIGATION
          </div>

          <NavSlot
            label="OVERVIEW"
            active
            available
            icon={
              <svg viewBox="0 0 16 16" width="18" height="18" fill="var(--color-grass-light)">
                <rect x="1" y="1" width="6" height="6" />
                <rect x="9" y="1" width="6" height="6" />
                <rect x="1" y="9" width="6" height="6" />
                <rect x="9" y="9" width="6" height="6" />
              </svg>
            }
          />
          <NavSlot
            label="ROVER"
            icon={
              <svg viewBox="0 0 16 16" width="18" height="18" fill="#555555">
                <rect x="3" y="2" width="10" height="8" />
                <rect x="1" y="10" width="14" height="4" />
              </svg>
            }
          />
          <NavSlot
            label="CAMERA"
            icon={
              <svg viewBox="0 0 16 16" width="18" height="18" fill="#555555">
                <rect x="1" y="4" width="14" height="10" />
                <circle cx="8" cy="9" r="3" fill="#3A3A3A" />
              </svg>
            }
          />
          <NavSlot
            label="TALK"
            icon={
              <svg viewBox="0 0 16 16" width="18" height="18" fill="#555555">
                <rect x="5" y="1" width="6" height="8" rx="1" />
                <path d="M3 7c0 2.76 2.24 5 5 5s5-2.24 5-5" stroke="#555" strokeWidth="1.5" fill="none" />
                <rect x="7" y="12" width="2" height="3" />
              </svg>
            }
          />
          <NavSlot
            label="MISSIONS"
            icon={
              <svg viewBox="0 0 16 16" width="18" height="18" fill="#555555">
                <rect x="2" y="2" width="5" height="12" />
                <rect x="9" y="6" width="5" height="8" />
                <rect x="2" y="1" width="12" height="2" fill="#CC2222" />
              </svg>
            }
          />

          <div style={{ flex: 1 }} />

          {/* Version tag */}
          <div
            style={{
              padding: '16px',
              borderTop: '1px solid #222222',
            }}
          >
            <div
              className="badge badge-offline"
              style={{ fontSize: '6px', display: 'inline-flex' }}
            >
              PHASE 1 — NO ROBOT
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {/* Config warning */}
          {notConfigured && (
            <div
              className="badge badge-error"
              style={{
                display: 'flex',
                padding: '14px 18px',
                marginBottom: '24px',
                fontSize: '12px',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.6,
              }}
            >
              <span style={{ flexShrink: 0 }}>⚠</span>
              <span>
                Supabase is not configured. This dashboard is a preview shell only.
                Real authentication requires credentials in{' '}
                <code
                  style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '9px',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    padding: '2px 4px',
                  }}
                >
                  apps/web/.env.local
                </code>
                .
              </span>
            </div>
          )}

          {/* Welcome panel */}
          <div
            className="block-panel"
            style={{
              padding: '28px 32px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            <CreeperFace size={64} expression="happy" animated />
            <div style={{ flex: 1 }}>
              <div
                className="heading-pixel"
                style={{
                  fontSize: '11px',
                  color: 'var(--color-grass-light)',
                  marginBottom: '8px',
                }}
              >
                WELCOME BACK, OPERATOR
              </div>
              {userEmail ? (
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: '#AAAAAA',
                  }}
                >
                  Signed in as{' '}
                  <span style={{ color: '#E8E8E8', fontWeight: 600 }}>{userEmail}</span>
                </p>
              ) : (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#777777' }}>
                  Account configuration required.
                </p>
              )}
              <div
                style={{
                  marginTop: '12px',
                  fontFamily: 'var(--font-vt)',
                  fontSize: '17px',
                  color: '#666666',
                }}
              >
                Your CreeperBot is waiting to be built.
              </div>
            </div>
          </div>

          {/* Status grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <StatusCard title="ROBOT STATUS">
              <div
                className="badge badge-offline"
                style={{ display: 'inline-flex', marginBottom: '10px' }}
              >
                <span>●</span>
                <span>DISCONNECTED</span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: '#666666',
                  lineHeight: 1.6,
                }}
              >
                No physical CreeperBot is paired to this account. Robot pairing will be
                available in a future phase.
              </p>
            </StatusCard>

            <StatusCard title="PAIRING">
              <div
                className="badge badge-warning"
                style={{ display: 'inline-flex', marginBottom: '10px' }}
              >
                <span>⚒</span>
                <span>NOT PAIRED</span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: '#666666',
                  lineHeight: 1.6,
                }}
              >
                Robot pairing requires the completed hardware and a firmware flash. Once paired,
                your bot will appear here.
              </p>
            </StatusCard>

            <StatusCard title="ACTIVE MISSION">
              <div
                className="badge badge-offline"
                style={{ display: 'inline-flex', marginBottom: '10px' }}
              >
                <span>—</span>
                <span>NONE</span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: '#666666',
                  lineHeight: 1.6,
                }}
              >
                Mission controls will be available once a robot is paired and validated.
              </p>
            </StatusCard>
          </div>

          {/* Rover placeholder panel */}
          <div
            className="block-panel"
            style={{ padding: '40px', textAlign: 'center' }}
          >
            <div style={{ marginBottom: '20px', display: 'inline-block', opacity: 0.35 }}>
              <CreeperFace size={72} expression="thinking" />
            </div>
            <div
              className="heading-pixel"
              style={{ fontSize: '9px', color: '#555555', marginBottom: '12px' }}
            >
              ROVER FEED — NOT AVAILABLE
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: '#555555',
                maxWidth: '400px',
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              When your CreeperBot is paired and online, live rover status, camera feed and mission
              controls will appear here. This phase establishes the account and dashboard foundation.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
