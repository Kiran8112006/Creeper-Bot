# CreeperBot Phase 2 — Manual RLS Verification Procedure

This document describes how to verify that Row Level Security policies are correctly
enforced in the live Supabase project using two separate test accounts.

**RLS cannot be fully verified by frontend unit tests alone.** These steps must be
performed in the Supabase SQL Editor or via the Supabase client with real sessions.

---

## Prerequisites

1. Migration `supabase/migrations/0001_initial_schema.sql` has been applied.
2. Two distinct user accounts exist: **Account A** and **Account B**.
3. A robot record exists in `public.robots` (inserted via the SQL Editor as a superuser).
4. Account A owns the robot via `robot_owners`.
5. Account B owns no robots.

### Setup SQL (run as postgres/superuser in SQL Editor)

```sql
-- 1. Insert a test robot (only superuser / service_role can do this —
--    confirms that browser clients cannot insert)
INSERT INTO public.robots (id, name, hardware_model, connection_status)
VALUES (
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    'Test-Bot-A',
    'ESP32 WROOM v1',
    'offline'
);

-- 2. Link it to Account A (replace with the real UUID from auth.users)
INSERT INTO public.robot_owners (user_id, robot_id, role)
VALUES (
    '<account-a-user-uuid>',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    'owner'
);
```

---

---

## Verification Methods

You can verify RLS using either **Method 1 (Supabase SQL Editor with role impersonation)** or **Method 2 (Live Browser Console with real user sessions)**.

> **CRITICAL NOTE ON SQL EDITOR:** In Supabase, the SQL Editor runs queries as the `postgres` superuser by default. Under `postgres`, `auth.uid()` is `NULL` and table owners may bypass RLS. To properly test authenticated user policies in the SQL Editor, you **must wrap the queries in a transaction that sets `SET LOCAL ROLE authenticated` and `request.jwt.claim.sub`**, as shown in Method 1 below.

---

## Method 1 — Supabase SQL Editor (Transaction Impersonation)

### Step 1 — Account A Isolation Check
Run this entire block in the SQL Editor:

```sql
BEGIN;
  -- Impersonate Account A
  SET LOCAL ROLE authenticated;
  SELECT set_config('request.jwt.claim.sub', '<account-a-user-uuid>', true);

  -- 1a. Must return exactly 1 row (Account A's profile)
  SELECT id, display_name FROM public.profiles;

  -- 1b. Must return exactly 1 row (Test-Bot-A)
  SELECT id, name, connection_status FROM public.robots;

  -- 1c. Must return exactly 1 row
  SELECT user_id, robot_id, role FROM public.robot_owners;
ROLLBACK;
```

### Step 2 — Account B Isolation & Cross-Account Protection
Run this entire block in the SQL Editor:

```sql
BEGIN;
  -- Impersonate Account B
  SET LOCAL ROLE authenticated;
  SELECT set_config('request.jwt.claim.sub', '<account-b-user-uuid>', true);

  -- 2a. Must return only Account B's profile (Account A's profile is invisible)
  SELECT id, display_name FROM public.profiles;

  -- 2b. Must return 0 rows (Account B owns no robots)
  SELECT id, name FROM public.robots;

  -- 2c. Must return 0 rows
  SELECT * FROM public.robot_owners;

  -- 2d. Attempt to update Account A's profile — must update 0 rows
  UPDATE public.profiles
  SET display_name = 'hacked'
  WHERE id = '<account-a-user-uuid>';

ROLLBACK;
```

### Step 3 — Unauthorized Write Rejections
Run this block to confirm that the `authenticated` role is strictly forbidden from direct writes on `robots` and `robot_owners`:

```sql
BEGIN;
  SET LOCAL ROLE authenticated;
  SELECT set_config('request.jwt.claim.sub', '<account-a-user-uuid>', true);

  -- 3a. Inserting a robot must fail with permission denied (no INSERT grant)
  INSERT INTO public.robots (name, connection_status)
  VALUES ('rogue-bot', 'online');
  -- Expected: ERROR: permission denied for table robots

ROLLBACK;
```

```sql
BEGIN;
  SET LOCAL ROLE authenticated;
  SELECT set_config('request.jwt.claim.sub', '<account-a-user-uuid>', true);

  -- 3b. Modifying robot connection status must fail (no UPDATE grant)
  UPDATE public.robots
  SET connection_status = 'online'
  WHERE id = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  -- Expected: ERROR: permission denied for table robots

ROLLBACK;
```

```sql
BEGIN;
  SET LOCAL ROLE authenticated;
  SELECT set_config('request.jwt.claim.sub', '<account-b-user-uuid>', true);

  -- 3c. Claiming robot ownership must fail (no INSERT grant)
  INSERT INTO public.robot_owners (user_id, robot_id, role)
  VALUES ('<account-b-user-uuid>', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'owner');
  -- Expected: ERROR: permission denied for table robot_owners

ROLLBACK;
```

---

## Method 2 — Live Browser Verification

1. Log into http://localhost:3000 as **Account A**:
   - The dashboard shows "1 ROBOT PAIRED" and displays "Test-Bot-A".
   - Open Developer Tools Console and verify:
     ```js
     const { data } = await supabase.from('profiles').select('*');
     console.log(data); // Returns only Account A's profile
     ```
2. Log into http://localhost:3000 in an Incognito window as **Account B**:
   - The dashboard shows "NO ROBOT PAIRED".
   - Open Developer Tools Console and verify:
     ```js
     const { data } = await supabase.from('robots').select('*');
     console.log(data); // Returns [] (0 rows)
     ```
3. In Account B's browser console, test unauthorized update:
   ```js
   const res = await supabase.from('profiles').update({ display_name: 'hacked' }).eq('id', '<account-a-uuid>');
   // RLS ensures 0 rows updated
   ```

---

## Results Log

Fill in actual results when tests are performed:

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| Account A — own profile | 1 row | — | NOT TESTED |
| Account A — own robot | 1 row | — | NOT TESTED |
| Account B — no profile leak | 0 foreign rows | — | NOT TESTED |
| Account B — no robot leak | 0 rows | — | NOT TESTED |
| Insert robot as browser client | Permission denied | — | NOT TESTED |
| Update foreign profile | 0 rows updated | — | NOT TESTED |
| Update robot status as browser | Permission denied | — | NOT TESTED |
| Insert robot_owners as browser | Permission denied | — | NOT TESTED |

---

## Notes

- All tests marked **NOT TESTED** because the migration has not yet been applied
  to the live Supabase project at the time Phase 2 was completed.
- Run this verification after applying the migration and creating two real test accounts.
- Keep test robot records separate from any production data.
- After verification, delete the test robot with:
  ```sql
  DELETE FROM public.robots WHERE id = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  ```
