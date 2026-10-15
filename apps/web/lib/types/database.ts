// TypeScript types mirroring the Phase 2 database schema.
// Keep these in sync with supabase/migrations/0001_initial_schema.sql.

export type ConnectionStatus = 'offline' | 'online' | 'pairing' | 'error';
export type OwnershipRole = 'owner';

export interface Profile {
  id: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Robot {
  id: string;
  name: string;
  hardware_model: string | null;
  connection_status: ConnectionStatus;
  last_seen_at: string | null;
  firmware_version: string | null;
  created_at: string;
  updated_at: string;
}

export interface RobotOwner {
  user_id: string;
  robot_id: string;
  role: OwnershipRole;
  created_at: string;
}

// Joined shape returned by the dashboard query
export interface OwnedRobot extends Robot {
  role: OwnershipRole;
}

// Result shapes for data-access functions
export type DataResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };
