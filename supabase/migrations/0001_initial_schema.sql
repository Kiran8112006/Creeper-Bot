-- ============================================================
-- CreeperBot — Phase 2 Database Schema
-- Migration: 0001_initial_schema.sql
-- Apply once in the Supabase SQL Editor for your project.
-- Do NOT apply multiple times — use idempotent guards.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- EXTENSIONS
-- ────────────────────────────────────────────────────────────
-- uuid-ossp is pre-enabled on all Supabase projects.
-- pgcrypto gives gen_random_uuid() as an alternative.
-- We use gen_random_uuid() which requires no extra extension
-- on modern PostgreSQL (14+).

-- ────────────────────────────────────────────────────────────
-- 1. PROFILES
-- One row per auth.users entry. Created automatically by
-- the trigger below. Never manually insert into this table.
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id           UUID        NOT NULL
        REFERENCES auth.users (id) ON DELETE CASCADE,
    display_name TEXT        DEFAULT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    -- display_name length guard — not empty strings if provided
    CONSTRAINT profiles_display_name_length
        CHECK (display_name IS NULL OR (length(trim(display_name)) > 0 AND length(display_name) <= 64))
);

COMMENT ON TABLE public.profiles IS
    'One profile per authenticated user. Created automatically on sign-up.';

-- ────────────────────────────────────────────────────────────
-- 2. ROBOTS
-- Represents a real registered physical device.
-- Rows are inserted only by a privileged server operation
-- (future phase). Normal browser clients cannot INSERT.
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.robots (
    id               UUID        NOT NULL DEFAULT gen_random_uuid(),
    name             TEXT        NOT NULL,
    hardware_model   TEXT        DEFAULT NULL,
    connection_status TEXT       NOT NULL DEFAULT 'offline',
    last_seen_at     TIMESTAMPTZ DEFAULT NULL,
    firmware_version TEXT        DEFAULT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT robots_pkey PRIMARY KEY (id),
    CONSTRAINT robots_name_nonempty
        CHECK (length(trim(name)) > 0),
    CONSTRAINT robots_name_length
        CHECK (length(name) <= 80),
    CONSTRAINT robots_connection_status_values
        CHECK (connection_status IN ('offline', 'online', 'pairing', 'error'))
);

COMMENT ON TABLE public.robots IS
    'One row per real registered physical CreeperBot device.
     Rows are created by a privileged backend operation only — not by browser clients.';

COMMENT ON COLUMN public.robots.connection_status IS
    'Server-maintained only. Allowed values: offline | online | pairing | error.
     Browser clients cannot update this column.';

-- ────────────────────────────────────────────────────────────
-- 3. ROBOT_OWNERS
-- Links an authenticated user to a robot they own.
-- For the MVP: one owner per robot (unique robot_id).
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.robot_owners (
    user_id    UUID        NOT NULL
        REFERENCES auth.users  (id) ON DELETE CASCADE,
    robot_id   UUID        NOT NULL
        REFERENCES public.robots (id) ON DELETE CASCADE,
    role       TEXT        NOT NULL DEFAULT 'owner',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT robot_owners_pkey    PRIMARY KEY (user_id, robot_id),
    -- One owner per physical robot (MVP constraint: device cannot have multiple owners)
    CONSTRAINT robot_owners_one_owner_per_robot UNIQUE (robot_id),
    -- One robot per user account (MVP constraint: user cannot own multiple robots)
    CONSTRAINT robot_owners_one_robot_per_user UNIQUE (user_id),
    CONSTRAINT robot_owners_role_values
        CHECK (role IN ('owner'))
);

COMMENT ON TABLE public.robot_owners IS
    'Maps users to their owned robots. MVP: strictly one robot per user and one owner per robot.
     Supporting multiple robots per account in a future phase will require an intentional
     schema migration dropping the robot_owners_one_robot_per_user constraint.';

-- ────────────────────────────────────────────────────────────
-- 4. UPDATED_AT AUTO-MAINTENANCE TRIGGER
-- ────────────────────────────────────────────────────────────
-- Simple trigger function to update updated_at timestamp.
-- Runs with invoker privileges (SECURITY DEFINER not required).
-- SET search_path = '' with schema-qualified pg_catalog.now()
-- adheres to current Supabase security guidelines.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = pg_catalog.now();
    RETURN NEW;
END;
$$;

-- Apply to profiles
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Apply to robots
DROP TRIGGER IF EXISTS trg_robots_updated_at ON public.robots;
CREATE TRIGGER trg_robots_updated_at
    BEFORE UPDATE ON public.robots
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ────────────────────────────────────────────────────────────
-- 5. NEW-USER PROFILE TRIGGER
-- Safely inserts a profile row when auth.users gets a new row.
-- Runs as SECURITY DEFINER to allow the Supabase Auth system to
-- populate public.profiles.
-- SET search_path = '' with fully schema-qualified functions/tables
-- follows current Supabase security recommendations.
-- Normalizes and truncates display_name to <= 64 characters.
-- ON CONFLICT (id) DO NOTHING ensures safe, idempotent re-execution.
-- Does not silently swallow fatal database errors, ensuring data
-- integrity and making systemic failures observable.
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_display_name TEXT;
BEGIN
    -- Safely extract and normalize display_name from metadata:
    -- - Handles NULL raw_user_meta_data or missing display_name key
    -- - Uses pg_catalog.btrim() for whitespace trimming (pg_catalog.trim does not exist as a catalog function)
    -- - Uses pg_catalog.substring(..., 1, 64) to adhere to profiles_display_name_length constraint
    v_display_name := CASE
        WHEN NEW.raw_user_meta_data IS NOT NULL
             AND NEW.raw_user_meta_data ? 'display_name'
             AND NEW.raw_user_meta_data->>'display_name' IS NOT NULL
             AND pg_catalog.length(pg_catalog.btrim(NEW.raw_user_meta_data->>'display_name')) > 0
        THEN pg_catalog.substring(pg_catalog.btrim(NEW.raw_user_meta_data->>'display_name'), 1, 64)
        ELSE NULL
    END;

    INSERT INTO public.profiles (id, display_name, created_at, updated_at)
    VALUES (NEW.id, v_display_name, pg_catalog.now(), pg_catalog.now())
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Attach to auth.users insert
DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 6. EXPLICIT GRANT CONTROL
-- Revoke broad public access; grant only what the anon and
-- authenticated roles need.
-- ────────────────────────────────────────────────────────────

-- Revoke all public defaults
REVOKE ALL ON public.profiles     FROM PUBLIC, anon;
REVOKE ALL ON public.robots       FROM PUBLIC, anon;
REVOKE ALL ON public.robot_owners FROM PUBLIC, anon;

-- Authenticated users: granular grants (RLS will further restrict)
GRANT SELECT, UPDATE (display_name, updated_at)
    ON public.profiles     TO authenticated;
GRANT SELECT
    ON public.robots       TO authenticated;
GRANT SELECT
    ON public.robot_owners TO authenticated;

-- anon role: no access to any private table
-- (RLS policies below are defence-in-depth, but grants are the primary gate)

-- ────────────────────────────────────────────────────────────
-- 7. ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.robots       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.robot_owners ENABLE ROW LEVEL SECURITY;

-- ── 7a. profiles ─────────────────────────────────────────────

-- Users can read only their own profile
CREATE POLICY "profiles: select own"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

-- Users can update only their own profile
CREATE POLICY "profiles: update own"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- No INSERT from browser (handled by trigger) — no INSERT policy.
-- No DELETE from browser — no DELETE policy.

-- ── 7b. robots ───────────────────────────────────────────────

-- A user can see a robot only if they appear in robot_owners for it.
-- Uses a sub-query on robot_owners; RLS on that table is separate.
-- We check auth.uid() directly to avoid trusting any passed-in value.
CREATE POLICY "robots: select owned"
    ON public.robots
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.robot_owners ro
            WHERE ro.robot_id = id
              AND ro.user_id  = auth.uid()
        )
    );

-- No INSERT / UPDATE / DELETE from browser clients.

-- ── 7c. robot_owners ─────────────────────────────────────────

-- Users can see only their own ownership records.
CREATE POLICY "robot_owners: select own"
    ON public.robot_owners
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- No INSERT / UPDATE / DELETE from browser clients.
-- Ownership assignment is a privileged server-only operation.

-- ────────────────────────────────────────────────────────────
-- 8. FORCE RLS ON TABLE OWNER
-- Ensures that even the table owner (supabase_admin) obeys
-- RLS when connecting as a non-superuser role.
-- This is belt-and-suspenders — Supabase already restricts
-- the anon/authenticated roles, but this prevents future
-- accidental bypasses.
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.profiles     FORCE ROW LEVEL SECURITY;
ALTER TABLE public.robots       FORCE ROW LEVEL SECURITY;
ALTER TABLE public.robot_owners FORCE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────
-- MIGRATION COMPLETE
-- Tables: profiles, robots, robot_owners
-- Triggers: handle_new_user, set_updated_at (×2)
-- RLS: enabled + forced on all three tables
-- Policies: 4 (select own profile, update own profile,
--             select owned robots, select own ownership records)
-- ────────────────────────────────────────────────────────────
