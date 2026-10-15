import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { fetchProfile, fetchOwnedRobots } from '@/lib/data/dashboard';
import CreeperFace from '@/components/ui/CreeperFace';
import ProfileEditForm from '@/components/dashboard/ProfileEditForm';
import { signOut } from './actions';
import type { Metadata } from 'next';
import type { OwnedRobot, Profile } from '@/lib/types/database';

export const metadata: Metadata = {
  title: 'Dashboard — CreeperBot',
  description: 'Your CreeperBot control centre.',
};

// In Next.js 16 with cacheComponents enabled, authenticated dynamic routes
// that read cookies() and user data use instant = false to allow dynamic rendering.
export const instant = false;




// ─── Shared sub-components ───────────────────────────────────

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
        backgroundColor: active ? 'rgba(93,138,48,0.15)' : 'transparent',
        borderLeft: active ? '3px solid var(--color-grass)' : '3px solid transparent',
        cursor: available ? 'pointer' : 'not-allowed',
        opacity: available || active ? 1 : 0.45,
        transition: 'background-color 150ms',
      }}
    >
      <div className="slot" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', color: active ? 'var(--color-grass-light)' : '#AAAAAA', letterSpacing: '0.08em' }}>
          {label}
        </div>
        {!available && (
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#555555', marginTop: '2px' }}>
            Not yet available
          </div>
        )}
      </div>
    </div>
  );
}

function StatusCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="block-panel" style={{ padding: '20px' }}>
      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', color: '#777777', letterSpacing: '0.1em', marginBottom: '12px', borderBottom: '1px solid #333333', paddingBottom: '8px' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

// ─── Robot status card — shown when a robot is owned ─────────

function RobotCard({ robot }: { robot: OwnedRobot }) {
  const statusColor = {
    online:  'var(--color-emerald-light)',
    offline: '#888888',
    pairing: 'var(--color-gold-light)',
    error:   'var(--color-redstone-light)',
  }[robot.connection_status] ?? '#888888';

  const statusBadgeClass = {
    online:  'badge-online',
    offline: 'badge-offline',
    pairing: 'badge-warning',
    error:   'badge-error',
  }[robot.connection_status] ?? 'badge-offline';

  const statusDot = robot.connection_status === 'online' ? '●' : '○';

  return (
    <div
      className="block-panel"
      style={{ padding: '20px', borderLeft: `4px solid ${statusColor}` }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: '#E8E8E8', marginBottom: '6px' }}>
            {robot.name}
          </div>
          {robot.hardware_model && (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#666666' }}>
              {robot.hardware_model}
            </div>
          )}
        </div>
        <div className={`badge ${statusBadgeClass}`} style={{ display: 'inline-flex', flexShrink: 0 }}>
          <span>{statusDot}</span>
          <span>{robot.connection_status.toUpperCase()}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
        <div style={{ color: '#555555' }}>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '6px', color: '#444444', display: 'block', marginBottom: '2px' }}>FIRMWARE</span>
          <span style={{ fontFamily: 'var(--font-body)', color: robot.firmware_version ? '#AAAAAA' : '#444444' }}>
            {robot.firmware_version ?? 'Unknown'}
          </span>
        </div>
        <div style={{ color: '#555555' }}>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '6px', color: '#444444', display: 'block', marginBottom: '2px' }}>LAST SEEN</span>
          <span style={{ fontFamily: 'var(--font-body)', color: robot.last_seen_at ? '#AAAAAA' : '#444444' }}>
            {robot.last_seen_at
              ? new Date(robot.last_seen_at).toLocaleString()
              : 'Never'}
          </span>
        </div>
      </div>

      <div
        className="badge badge-offline"
        style={{ display: 'inline-flex', marginTop: '14px', fontSize: '7px' }}
      >
        <span>ℹ</span>
        <span>STATUS IS SERVER-MAINTAINED — NOT REAL-TIME IN THIS PHASE</span>
      </div>
    </div>
  );
}

// ─── No robot state ──────────────────────────────────────────

function NoPairedRobot() {
  return (
    <div className="block-panel" style={{ padding: '40px', textAlign: 'center' }}>
      <div style={{ marginBottom: '20px', display: 'inline-block', opacity: 0.35 }}>
        <CreeperFace size={72} expression="thinking" />
      </div>
      <div className="heading-pixel" style={{ fontSize: '9px', color: '#555555', marginBottom: '12px' }}>
        NO ROBOT PAIRED
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#555555', maxWidth: '400px', margin: '0 auto', lineHeight: 1.7 }}>
        Your account has no physical CreeperBot paired to it yet. Robot pairing will be available in a
        future phase once the hardware is built and validated.
      </p>
    </div>
  );
}

// ─── Database error state ────────────────────────────────────

function DbErrorNotice({ message }: { message: string }) {
  return (
    <div
      className="badge badge-error"
      style={{ display: 'flex', padding: '12px 16px', marginBottom: '20px', fontSize: '12px', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}
    >
      <span style={{ flexShrink: 0 }}>⚠</span>
      <span>Database query failed: {message}. If the migration has not been applied yet, run it in your Supabase SQL Editor first.</span>
    </div>
  );
}

// ─── Migration notice ────────────────────────────────────────

function MigrationNotice() {
  return (
    <div
      className="badge badge-warning"
      style={{ display: 'flex', padding: '12px 16px', marginBottom: '20px', fontSize: '12px', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}
    >
      <span style={{ flexShrink: 0 }}>⚒</span>
      <span>
        Database migration not yet applied. Profile and robot data are unavailable.
        Apply <code style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', backgroundColor: 'rgba(0,0,0,0.3)', padding: '2px 4px' }}>supabase/migrations/0001_initial_schema.sql</code> in
        your Supabase SQL Editor, then refresh this page.
      </span>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createClient();

  if (!supabase) {
    return <DashboardShell notConfigured userEmail={null} profile={null} robots={[]} robotError={null} profileError={null} migrationMissing={false} />;
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/sign-in');
  }

  // Parallel data fetching
  const [profileResult, robotsResult] = await Promise.all([
    fetchProfile(supabase, user.id),
    fetchOwnedRobots(supabase),
  ]);

  // Migration-missing detection: both return null data with no error
  const migrationMissing =
    profileResult.data === null && profileResult.error === null &&
    robotsResult.data !== null && robotsResult.data.length === 0 &&
    robotsResult.error === null;

  return (
    <DashboardShell
      userEmail={user.email ?? null}
      profile={profileResult.data}
      robots={robotsResult.data ?? []}
      profileError={profileResult.error}
      robotError={robotsResult.error}
      migrationMissing={migrationMissing}
      notConfigured={false}
    />
  );
}

// ─── Shell ───────────────────────────────────────────────────

function DashboardShell({
  userEmail,
  profile,
  robots,
  profileError,
  robotError,
  migrationMissing,
  notConfigured,
}: {
  userEmail: string | null;
  profile: Profile | null;
  robots: OwnedRobot[];
  profileError: string | null;
  robotError: string | null;
  migrationMissing: boolean;
  notConfigured: boolean;
}) {
  const displayName = profile?.display_name ?? null;
  const greeting = displayName ?? userEmail?.split('@')[0] ?? 'Operator';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-cave)' }}>
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
          <span className="heading-pixel" style={{ fontSize: '8px', color: '#E8E8E8' }}>CreeperBot</span>
          <div style={{ width: '1px', height: '20px', backgroundColor: '#333333', marginLeft: '4px' }} />
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', color: '#777777', letterSpacing: '0.08em' }}>
            CONTROL CENTRE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {userEmail && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#777777', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName ? `${displayName} (${userEmail})` : userEmail}
            </span>
          )}
          {!notConfigured && (
            <form action={signOut}>
              <button id="dashboard-signout-btn" type="submit" className="btn btn-secondary btn-sm">
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
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '6px', color: '#444444', padding: '0 16px 12px', letterSpacing: '0.1em' }}>
            NAVIGATION
          </div>

          <NavSlot label="OVERVIEW" active available icon={
            <svg viewBox="0 0 16 16" width="18" height="18" fill="var(--color-grass-light)">
              <rect x="1" y="1" width="6" height="6" /><rect x="9" y="1" width="6" height="6" />
              <rect x="1" y="9" width="6" height="6" /><rect x="9" y="9" width="6" height="6" />
            </svg>
          } />
          <NavSlot label="ROVER" icon={<svg viewBox="0 0 16 16" width="18" height="18" fill="#555555"><rect x="3" y="2" width="10" height="8" /><rect x="1" y="10" width="14" height="4" /></svg>} />
          <NavSlot label="CAMERA" icon={<svg viewBox="0 0 16 16" width="18" height="18" fill="#555555"><rect x="1" y="4" width="14" height="10" /><circle cx="8" cy="9" r="3" fill="#3A3A3A" /></svg>} />
          <NavSlot label="TALK" icon={<svg viewBox="0 0 16 16" width="18" height="18" fill="#555555"><rect x="5" y="1" width="6" height="8" rx="1" /><path d="M3 7c0 2.76 2.24 5 5 5s5-2.24 5-5" stroke="#555" strokeWidth="1.5" fill="none" /><rect x="7" y="12" width="2" height="3" /></svg>} />
          <NavSlot label="MISSIONS" icon={<svg viewBox="0 0 16 16" width="18" height="18" fill="#555555"><rect x="2" y="2" width="5" height="12" /><rect x="9" y="6" width="5" height="8" /><rect x="2" y="1" width="12" height="2" fill="#CC2222" /></svg>} />

          <div style={{ flex: 1 }} />

          <div style={{ padding: '16px', borderTop: '1px solid #222222' }}>
            <div className="badge badge-offline" style={{ fontSize: '6px', display: 'inline-flex' }}>
              PHASE 2 — {robots.length > 0 ? `${robots.length} ROBOT` : 'NO ROBOT'}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

          {/* ── Notices ── */}
          {notConfigured && (
            <div className="badge badge-error" style={{ display: 'flex', padding: '14px 18px', marginBottom: '24px', fontSize: '12px', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
              <span style={{ flexShrink: 0 }}>⚠</span>
              <span>Supabase is not configured. Add credentials to <code style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', backgroundColor: 'rgba(0,0,0,0.3)', padding: '2px 4px' }}>apps/web/.env.local</code>.</span>
            </div>
          )}
          {migrationMissing && <MigrationNotice />}
          {profileError && <DbErrorNotice message={profileError} />}
          {robotError && <DbErrorNotice message={robotError} />}

          {/* ── Welcome panel ── */}
          <div
            className="block-panel"
            style={{ padding: '28px 32px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}
          >
            <CreeperFace size={64} expression="happy" animated />
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div className="heading-pixel" style={{ fontSize: '11px', color: 'var(--color-grass-light)', marginBottom: '8px' }}>
                WELCOME BACK, {greeting.toUpperCase()}
              </div>
              {userEmail && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#AAAAAA', marginBottom: '16px' }}>
                  Signed in as <span style={{ color: '#E8E8E8', fontWeight: 600 }}>{userEmail}</span>
                </p>
              )}
              {/* Profile edit form */}
              {!notConfigured && !migrationMissing && (
                <ProfileEditForm profile={profile} />
              )}
            </div>
          </div>

          {/* ── Status grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <StatusCard title="ROBOT STATUS">
              {robots.length > 0 ? (
                <>
                  <div className="badge badge-online" style={{ display: 'inline-flex', marginBottom: '10px' }}>
                    <span>●</span>
                    <span>{robots.length} ROBOT PAIRED</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#888888', lineHeight: 1.6 }}>
                    {robots[0].name} — connection status is server-maintained.
                  </p>
                </>
              ) : (
                <>
                  <div className="badge badge-offline" style={{ display: 'inline-flex', marginBottom: '10px' }}>
                    <span>●</span>
                    <span>NO ROBOT PAIRED</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#666666', lineHeight: 1.6 }}>
                    No physical CreeperBot is paired to this account. Pairing will be available in a future phase.
                  </p>
                </>
              )}
            </StatusCard>

            <StatusCard title="ACCOUNT">
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#AAAAAA', lineHeight: 1.8 }}>
                <div><span style={{ color: '#666666' }}>Email: </span>{userEmail ?? '—'}</div>
                <div><span style={{ color: '#666666' }}>Display name: </span>
                  {displayName
                    ? <span style={{ color: '#E8E8E8' }}>{displayName}</span>
                    : <span style={{ color: '#444444' }}>Not set</span>}
                </div>
                <div><span style={{ color: '#666666' }}>Robots: </span>{robots.length}</div>
              </div>
            </StatusCard>

            <StatusCard title="ACTIVE MISSION">
              <div className="badge badge-offline" style={{ display: 'inline-flex', marginBottom: '10px' }}>
                <span>—</span>
                <span>NONE</span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#666666', lineHeight: 1.6 }}>
                Mission controls will be available once a robot is paired and validated.
              </p>
            </StatusCard>
          </div>

          {/* ── Robot detail or empty state ── */}
          {robots.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="heading-pixel" style={{ fontSize: '8px', color: '#777777', marginBottom: '4px' }}>
                YOUR ROBOT{robots.length > 1 ? 'S' : ''}
              </div>
              {robots.map((robot) => (
                <RobotCard key={robot.id} robot={robot} />
              ))}
            </div>
          ) : (
            <NoPairedRobot />
          )}
        </main>
      </div>
    </div>
  );
}
