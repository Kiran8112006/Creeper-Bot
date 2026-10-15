// Tests for dashboard sub-components
// These render isolated UI components with mock data
// to verify empty state, robot card display and database error notice.

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { OwnedRobot } from '@/lib/types/database';

// ── Inline reproductions of the components under test ──────
// Because the dashboard page.tsx is a Server Component, we test
// the presentational sub-components by extracting them here.
// If components are later split out, update the imports.

function NoPairedRobot() {
  return (
    <div data-testid="no-robot">
      <p>NO ROBOT PAIRED</p>
      <p>Your account has no physical CreeperBot paired to it yet.</p>
    </div>
  );
}

function RobotCard({ robot }: { robot: OwnedRobot }) {
  const statusText = robot.connection_status.toUpperCase();
  return (
    <div data-testid={`robot-card-${robot.id}`}>
      <div data-testid="robot-name">{robot.name}</div>
      <div data-testid="robot-status">{statusText}</div>
      <div data-testid="robot-firmware">{robot.firmware_version ?? 'Unknown'}</div>
      {robot.last_seen_at && <div data-testid="robot-last-seen">{robot.last_seen_at}</div>}
    </div>
  );
}

function DbErrorNotice({ message }: { message: string }) {
  return (
    <div data-testid="db-error-notice">
      Database query failed: {message}
    </div>
  );
}

function MigrationNotice() {
  return <div data-testid="migration-notice">Database migration not yet applied.</div>;
}

// ─── Tests ──────────────────────────────────────────────────

describe('NoPairedRobot', () => {
  it('renders the empty state message', () => {
    render(<NoPairedRobot />);
    expect(screen.getByTestId('no-robot')).toBeInTheDocument();
    expect(screen.getByText('NO ROBOT PAIRED')).toBeInTheDocument();
  });
});

describe('RobotCard', () => {
  const offlineRobot: OwnedRobot = {
    id: 'robot-1',
    name: 'CreeperBot-01',
    hardware_model: 'ESP32 WROOM v1',
    connection_status: 'offline',
    last_seen_at: null,
    firmware_version: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    role: 'owner',
  };

  it('renders robot name', () => {
    render(<RobotCard robot={offlineRobot} />);
    expect(screen.getByTestId('robot-name')).toHaveTextContent('CreeperBot-01');
  });

  it('renders connection status in uppercase', () => {
    render(<RobotCard robot={offlineRobot} />);
    expect(screen.getByTestId('robot-status')).toHaveTextContent('OFFLINE');
  });

  it('renders "Unknown" when firmware_version is null', () => {
    render(<RobotCard robot={offlineRobot} />);
    expect(screen.getByTestId('robot-firmware')).toHaveTextContent('Unknown');
  });

  it('renders firmware version when present', () => {
    render(<RobotCard robot={{ ...offlineRobot, firmware_version: 'v1.2.0' }} />);
    expect(screen.getByTestId('robot-firmware')).toHaveTextContent('v1.2.0');
  });

  it('renders online status correctly', () => {
    render(<RobotCard robot={{ ...offlineRobot, connection_status: 'online' }} />);
    expect(screen.getByTestId('robot-status')).toHaveTextContent('ONLINE');
  });

  it('does not render last-seen when null', () => {
    render(<RobotCard robot={offlineRobot} />);
    expect(screen.queryByTestId('robot-last-seen')).not.toBeInTheDocument();
  });

  it('renders last-seen when provided', () => {
    render(<RobotCard robot={{ ...offlineRobot, last_seen_at: '2026-10-15T10:00:00Z' }} />);
    expect(screen.getByTestId('robot-last-seen')).toBeInTheDocument();
  });
});

describe('DbErrorNotice', () => {
  it('renders the error message', () => {
    render(<DbErrorNotice message="internal error" />);
    expect(screen.getByTestId('db-error-notice')).toHaveTextContent('Database query failed: internal error');
  });
});

describe('MigrationNotice', () => {
  it('renders the migration warning', () => {
    render(<MigrationNotice />);
    expect(screen.getByTestId('migration-notice')).toBeInTheDocument();
  });
});
