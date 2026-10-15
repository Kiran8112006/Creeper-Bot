# CreeperBot Phase 2 — Database Migration Guide

## What this migration does

File: `supabase/migrations/0001_initial_schema.sql`

Creates:
- `public.profiles` — one row per auth user, auto-created on sign-up
- `public.robots` — registered physical devices (server-managed only)
- `public.robot_owners` — links users to robots they own
- Triggers: `handle_new_user` (auto-creates profile), `set_updated_at` (×2)
- RLS policies (4): select/update own profile, select owned robots, select own ownership records
- Explicit GRANT control: authenticated role gets SELECT on robots/robot_owners, SELECT+UPDATE(display_name) on profiles; anon gets nothing

## How to apply the migration

### Option A — Supabase SQL Editor (recommended for this phase)

1. Open your Supabase project at https://supabase.com/dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Open `supabase/migrations/0001_initial_schema.sql` from this repository
5. Copy the entire file contents into the SQL Editor
6. Click **Run**
7. Verify: the output should show no errors
8. In the **Table Editor**, confirm three new tables: `profiles`, `robots`, `robot_owners`

### Option B — Supabase CLI (future)

When the Supabase CLI is configured for this project:

```bash
supabase db push
```

or for local development:

```bash
supabase migration up
```

The CLI is not required for this phase.

## Verifying the migration was applied

In the SQL Editor, run:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'robots', 'robot_owners')
ORDER BY table_name;
```

Expected: 3 rows.

Check RLS is enabled:

```sql
SELECT schemaname, tablename, rowsecurity, forcerowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'robots', 'robot_owners');
```

Expected: `rowsecurity = true` and `forcerowsecurity = true` for all three tables.

## After the migration

1. Refresh your dashboard at http://localhost:3000/dashboard
2. The "Database migration not yet applied" warning should disappear
3. Your profile row will have been created automatically when you signed up
4. The dashboard will show "No robot paired" — this is correct; no robot records exist yet
5. Display name editing is now active — try saving a name

## Security notes

- The `handle_new_user` trigger runs as `SECURITY DEFINER` with `SET search_path = ''` and fully schema-qualified functions (`pg_catalog.*`, `public.*`) following current Supabase recommendations.
- Display name is safely extracted, normalized (trimmed), and truncated to 64 characters to guarantee compliance with the `profiles_display_name_length` check constraint.
- `ON CONFLICT (id) DO NOTHING` guarantees idempotent execution without duplicate key errors if the trigger runs multiple times.
- Browser clients (anon key) cannot INSERT into `robots` or `robot_owners` — only a server-side operation with the service_role key can do this.
- Robot connection status (`connection_status`, `last_seen_at`, `firmware_version`) is server-maintained and cannot be updated by browser clients.
- Never add the `service_role` key to `apps/web/.env.local` or any `NEXT_PUBLIC_` variable.

## Table relationships & MVP Constraints

```
auth.users
    │
    ├── profiles (1:1, CASCADE DELETE)
    │
    └── robot_owners (1:1 MVP constraint: UNIQUE user_id, UNIQUE robot_id)
              │
              └── robots (registered physical devices)
```

### One-User / One-Robot MVP Constraint:
- `robot_owners` contains two distinct unique constraints:
  - `robot_owners_one_owner_per_robot UNIQUE (robot_id)`: A robot can have at most one owner.
  - `robot_owners_one_robot_per_user UNIQUE (user_id)`: A user can own at most one robot.
- **Future Expansion Note:** Allowing multiple robots per user account in a future phase will require an intentional schema migration to drop `robot_owners_one_robot_per_user`.

## RLS policy summary

| Table | Operation | Policy |
|-------|-----------|--------|
| profiles | SELECT | `id = auth.uid()` |
| profiles | UPDATE | `id = auth.uid()` (display_name, updated_at only) |
| profiles | INSERT | None (trigger only) |
| profiles | DELETE | None |
| robots | SELECT | EXISTS in robot_owners WHERE user_id = auth.uid() |
| robots | INSERT/UPDATE/DELETE | None (server-only) |
| robot_owners | SELECT | `user_id = auth.uid()` |
| robot_owners | INSERT/UPDATE/DELETE | None (server-only) |
