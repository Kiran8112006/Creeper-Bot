// Data-access functions for Phase 2 database queries.
// All queries run through the server-side Supabase client (with the user's session).
// RLS on the database enforces ownership — these functions never pass user_id as a
// query parameter that a browser could forge. They rely on auth.uid() in RLS policies.

import type { SupabaseClient } from '@supabase/supabase-js';
import type { DataResult, OwnedRobot, Profile } from '@/lib/types/database';

// ─── Profile ────────────────────────────────────────────────

/**
 * Fetch the current user's profile.
 * When userId is provided, queries specifically for that ID (defense-in-depth alongside RLS).
 * Returns null data (not an error) when the migration has not yet been applied.
 */
export async function fetchProfile(
  supabase: SupabaseClient,
  userId?: string
): Promise<DataResult<Profile | null>> {
  let query = supabase
    .from('profiles')
    .select('id, display_name, created_at, updated_at');

  if (userId && userId.trim().length > 0) {
    query = query.eq('id', userId.trim());
  }

  const { data, error } = await query.single();

  if (error) {
    // PGRST116 = no rows (profile not yet created — migration may not be applied)
    if (error.code === 'PGRST116') {
      return { data: null, error: null };
    }
    // 42P01 = undefined_table (migration not applied yet)
    if (error.code === '42P01') {
      return { data: null, error: null };
    }
    return { data: null, error: error.message };
  }

  return { data: data as Profile, error: null };
}

/**
 * Normalizes display name input mirroring the database trigger logic:
 * - Trims leading and trailing whitespace
 * - Treats missing, empty, or whitespace-only inputs as null
 * - Truncates excessively long display names to the 64-character column limit
 */
export function normalizeDisplayName(raw: unknown): string | null {
  if (typeof raw !== 'string') {
    return null;
  }
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return null;
  }
  return trimmed.slice(0, 64);
}

/**
 * Update the current user's display_name.
 * Returns the updated profile.
 * Validates userId and input constraints. The UPDATE grant and RLS policy
 * ensure only the profile owner can complete this operation.
 */
export async function updateDisplayName(
  supabase: SupabaseClient,
  userId: string,
  displayName: string
): Promise<DataResult<Profile>> {
  if (!userId || userId.trim().length === 0) {
    return { data: null, error: 'User ID is required.' };
  }

  const trimmed = displayName.trim();

  if (trimmed.length === 0) {
    return { data: null, error: 'Display name cannot be empty.' };
  }
  if (trimmed.length > 64) {
    return { data: null, error: 'Display name must be 64 characters or fewer.' };
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ display_name: trimmed, updated_at: new Date().toISOString() })
    .eq('id', userId.trim())
    .select('id, display_name, created_at, updated_at')
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Profile, error: null };
}

// ─── Robots ─────────────────────────────────────────────────

/**
 * Fetch all robots owned by the current authenticated user.
 * Returns an empty array (not an error) when the user has no paired robots
 * or when the migration has not yet been applied.
 */
export async function fetchOwnedRobots(
  supabase: SupabaseClient
): Promise<DataResult<OwnedRobot[]>> {
  // Join robot_owners → robots, filtering by the authenticated user's ownership.
  // RLS on robot_owners already restricts rows to the current user;
  // this join is belt-and-suspenders and gives us the robot detail in one query.
  const { data, error } = await supabase
    .from('robot_owners')
    .select(`
      role,
      robots (
        id,
        name,
        hardware_model,
        connection_status,
        last_seen_at,
        firmware_version,
        created_at,
        updated_at
      )
    `);

  if (error) {
    // Migration not yet applied — treat as empty, not a fatal error
    if (error.code === '42P01') {
      return { data: [], error: null };
    }
    return { data: null, error: error.message };
  }

  // Flatten the join result into OwnedRobot[]
  // Supabase returns the foreign-key join as a single object (not array)
  // even though the TypeScript inference may vary by version.
  // We use unknown casts to handle the runtime shape safely.
  const owned: OwnedRobot[] = (data ?? [])
    .filter((row: unknown) => {
      const r = row as { robots: unknown };
      return r.robots !== null && r.robots !== undefined;
    })
    .map((row: unknown) => {
      const r = row as { role: string; robots: Record<string, unknown> };
      return {
        ...(r.robots as Omit<OwnedRobot, 'role'>),
        role: r.role as 'owner',
      };
    });

  return { data: owned, error: null };
}
