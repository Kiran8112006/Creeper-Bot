// Tests for the data-access layer (lib/data/dashboard.ts)
// These tests mock the Supabase client to verify query logic,
// error handling and the migration-not-applied (42P01) case.
// They do NOT test live RLS — see manual-rls-verification.md for that.

import { describe, it, expect, vi } from 'vitest';
import { fetchProfile, fetchOwnedRobots, updateDisplayName, normalizeDisplayName } from '@/lib/data/dashboard';
import type { SupabaseClient } from '@supabase/supabase-js';



// ─── fetchProfile ────────────────────────────────────────────

describe('fetchProfile', () => {
  it('returns profile data when query succeeds', async () => {
    const profile = { id: 'user-1', display_name: 'Steve', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' };
    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: profile, error: null }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchProfile(client);
    expect(result.error).toBeNull();
    expect(result.data).toEqual(profile);
  });

  it('returns null data (not error) when profile not found (PGRST116)', async () => {
    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'No rows' } }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchProfile(client);
    expect(result.error).toBeNull();
    expect(result.data).toBeNull();
  });

  it('returns null data (not error) when table missing (42P01 — migration not applied)', async () => {
    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: '42P01', message: 'relation "profiles" does not exist' } }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchProfile(client);
    expect(result.error).toBeNull();
    expect(result.data).toBeNull();
  });

  it('returns an error string for unexpected database errors', async () => {
    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: 'XX000', message: 'internal error' } }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchProfile(client);
    expect(result.error).toBe('internal error');
    expect(result.data).toBeNull();
  });

  it('applies eq("id", userId) when userId is provided for defense-in-depth', async () => {
    const profile = { id: 'user-42', display_name: 'Alex', created_at: '', updated_at: '' };
    const eqMock = vi.fn().mockReturnThis();
    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: eqMock,
          single: vi.fn().mockResolvedValue({ data: profile, error: null }),
        }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchProfile(client, 'user-42');
    expect(eqMock).toHaveBeenCalledWith('id', 'user-42');
    expect(result.data).toEqual(profile);
  });
});

// ─── fetchOwnedRobots ────────────────────────────────────────

describe('fetchOwnedRobots', () => {
  it('returns empty array when user has no robots', async () => {
    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchOwnedRobots(client);
    expect(result.error).toBeNull();
    expect(result.data).toEqual([]);
  });

  it('returns owned robots flattened from join result', async () => {
    const robotRow = {
      id: 'robot-1',
      name: 'CreeperBot-01',
      hardware_model: 'ESP32 WROOM v1',
      connection_status: 'offline' as const,
      last_seen_at: null,
      firmware_version: null,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };
    const joinRow = { role: 'owner', robots: robotRow };

    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: [joinRow], error: null }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchOwnedRobots(client);
    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(1);
    expect(result.data![0].name).toBe('CreeperBot-01');
    expect(result.data![0].role).toBe('owner');
  });

  it('skips join rows where robots is null', async () => {
    const joinRow = { role: 'owner', robots: null };

    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: [joinRow], error: null }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchOwnedRobots(client);
    expect(result.data).toEqual([]);
  });

  it('returns empty array (not error) when migration not applied (42P01)', async () => {
    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: null, error: { code: '42P01', message: 'relation "robot_owners" does not exist' } }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchOwnedRobots(client);
    expect(result.error).toBeNull();
    expect(result.data).toEqual([]);
  });

  it('returns error string for unexpected query failures', async () => {
    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: null, error: { code: '08006', message: 'connection failure' } }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchOwnedRobots(client);
    expect(result.error).toBe('connection failure');
    expect(result.data).toBeNull();
  });
});

// ─── updateDisplayName ───────────────────────────────────────

describe('updateDisplayName', () => {
  it('rejects empty display name', async () => {
    const client = {} as unknown as SupabaseClient;
    const result = await updateDisplayName(client, 'user-1', '   ');
    expect(result.error).toBe('Display name cannot be empty.');
    expect(result.data).toBeNull();
  });

  it('rejects display name over 64 chars', async () => {
    const client = {} as unknown as SupabaseClient;
    const longName = 'a'.repeat(65);
    const result = await updateDisplayName(client, 'user-1', longName);
    expect(result.error).toBe('Display name must be 64 characters or fewer.');
    expect(result.data).toBeNull();
  });

  it('accepts exactly 64 chars', async () => {
    const updated = { id: 'user-1', display_name: 'a'.repeat(64), created_at: '', updated_at: '' };
    const client = {
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq:     vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updated, error: null }),
      }),
    } as unknown as SupabaseClient;

    const result = await updateDisplayName(client, 'user-1', 'a'.repeat(64));
    expect(result.error).toBeNull();
    expect(result.data?.display_name).toHaveLength(64);
  });

  it('trims whitespace before validation and save', async () => {
    const updated = { id: 'user-1', display_name: 'Steve', created_at: '', updated_at: '' };
    const client = {
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq:     vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updated, error: null }),
      }),
    } as unknown as SupabaseClient;

    const result = await updateDisplayName(client, 'user-1', '  Steve  ');
    expect(result.error).toBeNull();
    expect(result.data?.display_name).toBe('Steve');
  });

  it('returns error string when database update fails', async () => {
    const client = {
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq:     vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'row not found' } }),
      }),
    } as unknown as SupabaseClient;

    const result = await updateDisplayName(client, 'user-1', 'Alex');
    expect(result.error).toBe('row not found');
  });

  it('rejects update if userId is missing or whitespace', async () => {
    const client = { from: vi.fn() } as unknown as SupabaseClient;

    const res1 = await updateDisplayName(client, '', 'Alex');
    expect(res1.error).toBe('User ID is required.');
    expect(res1.data).toBeNull();

    const res2 = await updateDisplayName(client, '   ', 'Alex');
    expect(res2.error).toBe('User ID is required.');
    expect(res2.data).toBeNull();
    expect(client.from).not.toHaveBeenCalled();
  });

  it('scopes update with .eq("id", userId.trim())', async () => {
    const updated = { id: 'user-99', display_name: 'Alex', created_at: '', updated_at: '' };
    const eqMock = vi.fn().mockReturnThis();
    const client = {
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: eqMock,
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updated, error: null }),
      }),
    } as unknown as SupabaseClient;

    const result = await updateDisplayName(client, '  user-99  ', 'Alex');
    expect(eqMock).toHaveBeenCalledWith('id', 'user-99');
    expect(result.error).toBeNull();
    expect(result.data?.id).toBe('user-99');
  });
});

// ─── normalizeDisplayName (Triggers & Validation) ───────────

describe('normalizeDisplayName', () => {
  it('returns null for missing or undefined inputs', () => {
    expect(normalizeDisplayName(undefined)).toBeNull();
    expect(normalizeDisplayName(null)).toBeNull();
    expect(normalizeDisplayName(12345)).toBeNull();
    expect(normalizeDisplayName({})).toBeNull();
  });

  it('returns null for empty or whitespace-only strings', () => {
    expect(normalizeDisplayName('')).toBeNull();
    expect(normalizeDisplayName('   ')).toBeNull();
    expect(normalizeDisplayName('\t\n ')).toBeNull();
  });

  it('preserves valid display names and trims surrounding whitespace', () => {
    expect(normalizeDisplayName('Steve')).toBe('Steve');
    expect(normalizeDisplayName('  Alex  ')).toBe('Alex');
    expect(normalizeDisplayName('Creeper Operator 1')).toBe('Creeper Operator 1');
  });

  it('safely truncates display names longer than 64 characters to 64 chars', () => {
    const longName = 'A'.repeat(80);
    const normalized = normalizeDisplayName(longName);
    expect(normalized).toHaveLength(64);
    expect(normalized).toBe('A'.repeat(64));
  });

  it('truncates after trimming whitespace', () => {
    const paddedLongName = '   ' + 'B'.repeat(70) + '   ';
    const normalized = normalizeDisplayName(paddedLongName);
    expect(normalized).toHaveLength(64);
    expect(normalized).toBe('B'.repeat(64));
  });
});

// ─── Data Layer Idempotency & Error Propagation ─────────────

describe('Idempotency & Failure Observability', () => {
  it('fetchProfile propagates genuine database connection errors to caller', async () => {
    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: '08006', message: 'connection failure' },
          }),
        }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchProfile(client);
    expect(result.data).toBeNull();
    expect(result.error).toBe('connection failure');
  });

  it('fetchOwnedRobots propagates genuine database permission errors to caller', async () => {
    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: null,
          error: { code: '42501', message: 'insufficient_privilege' },
        }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchOwnedRobots(client);
    expect(result.data).toBeNull();
    expect(result.error).toBe('insufficient_privilege');
  });
});

