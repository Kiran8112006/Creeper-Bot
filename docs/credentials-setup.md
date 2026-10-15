# CreeperBot — Credential & Environment Setup Guide

This guide walks you through configuring **Supabase authentication** for local development.
You will configure the credentials yourself — never paste secrets into the Antigravity chat.

---

## 1. Create a Supabase Account and Project

1. Open **https://supabase.com** in your browser.
2. Click **Start your project** (free account, no credit card required).
3. Sign up with GitHub or email.
4. After signing in, click **New project**.
5. Choose a name (e.g. `creeperbot`), set a strong database password (save it somewhere safe) and select the region closest to you.
6. Click **Create new project** and wait for provisioning (~1–2 minutes).

> **Free-tier limitations to be aware of:**
> - Projects on the free tier are **paused after 1 week of inactivity**. Reactivate from the Supabase dashboard.
> - The free tier includes 50,000 monthly active users for Auth — more than enough for development.
> - Storage and database limits apply; see https://supabase.com/pricing for current numbers.
> - No credit card is required to create a free project.

---

## 2. Find Your Project URL and Publishable Key

1. In your Supabase project, open the left sidebar.
2. Click **Project Settings** (gear icon at the bottom left).
3. Click **Data API** (or **API** depending on dashboard version).
4. Under **Project URL**, copy the value — it looks like:
   ```
   https://abcdefghijklmno.supabase.co
   ```
5. Under **Project API keys**, find the row labelled **`anon` / `public`**.
   Copy that key. It looks like a long JWT string beginning with `eyJ...`.

> **Key safety distinction:**
> - **`anon` (publishable) key** — safe to include in client-side and browser code. This is `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
> - **`service_role` key** — has admin privileges and bypasses Row Level Security. **Never expose this in client code or commit it to Git.** It is not used in Phase 1.

---

## 3. Configure Local Environment Variables

1. Navigate to `apps/web/` in this repository.
2. Copy the example file:
   ```powershell
   Copy-Item .env.example .env.local
   ```
3. Open `apps/web/.env.local` in a text editor.
4. Fill in the three values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmno.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...your-anon-key...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
5. **Save the file. Never commit it.** The `.gitignore` in `apps/web/` already excludes `.env*`.

---

## 4. Configure Supabase Auth Redirect URLs

Supabase must know which URLs it is allowed to redirect back to after email confirmation.

1. In the Supabase dashboard, go to **Authentication → URL Configuration**.
2. Set **Site URL** to:
   ```
   http://localhost:3000
   ```
3. Under **Redirect URLs**, add:
   ```
   http://localhost:3000/auth/callback
   ```
4. Click **Save**.

> When you deploy to Vercel later, add your production URLs here as well (e.g. `https://creeperbot.vercel.app` and `https://creeperbot.vercel.app/auth/callback`).

---

## 5. (Optional) Email Confirmation Settings

By default, Supabase requires email confirmation before a new account is active.

- To keep this on (recommended for production): leave the default.
  The sign-up page will prompt users to check their email.
- To disable it for faster local testing:
  Go to **Authentication → Providers → Email** and toggle off **Confirm email**.

---

## 6. Start the Website Locally

```powershell
cd apps\web
npm run dev
```

The site will be available at **http://localhost:3000**.

- Landing page: http://localhost:3000
- Sign up:       http://localhost:3000/sign-up
- Sign in:       http://localhost:3000/sign-in
- Dashboard:     http://localhost:3000/dashboard

---

## 7. Test a Real Registration and Login

1. Open http://localhost:3000/sign-up.
2. Enter an email address you can access and a strong password.
3. Click **CREATE ACCOUNT**.
4. If email confirmation is enabled: check your inbox and click the link.
   The link will redirect to http://localhost:3000/auth/callback → /dashboard.
5. If confirmation is disabled: sign in immediately at /sign-in.
6. After signing in, you should see the dashboard with your email displayed.
7. Click **SIGN OUT** — you should be returned to the landing page.

---

## 8. Verify Configuration Without Printing Secrets

To check that your environment variables are loaded without revealing their values:

```powershell
cd apps\web
node -e "const u = process.env.NEXT_PUBLIC_SUPABASE_URL; console.log('URL set:', Boolean(u), '| Length:', u?.length ?? 0)"
```

This prints whether the variable is set and its character count — not the actual value.

Alternatively, visit the sign-up or sign-in page with the dev server running.
If configured correctly, the red **"Supabase is not configured"** warning will be absent.

---

## 9. Environment Variables in Vercel (Future Deployment)

When you are ready to deploy:

1. Push the repository to GitHub.
2. Log in to **https://vercel.com** and import the repository.
3. Set the **Root Directory** to `apps/web`.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — your anon/public key
   - `NEXT_PUBLIC_SITE_URL` — your Vercel deployment URL (e.g. `https://creeperbot.vercel.app`)
5. Deploy. Do **not** add the `service_role` key or `GEMINI_API_KEY` until those phases are approved.
6. Update Supabase **Authentication → URL Configuration** with the Vercel URL and callback URL.

> **Vercel free-tier limitations:**
> - Hobby plan includes 100 GB bandwidth per month.
> - 100 serverless function executions per day on the hobby tier is a soft guideline; check current Vercel pricing.
> - Automatic deployments on every push are included.

---

## 10. Key Files Reference

| File | Purpose |
|------|---------|
| `apps/web/.env.example` | Template — copy to `.env.local` |
| `apps/web/.env.local` | Your real credentials — **never commit** |
| `apps/web/.gitignore` | Already excludes `.env*` |
| `apps/web/lib/env.ts` | Validates presence of env vars without leaking values |
| `apps/web/lib/supabase/client.ts` | Browser-side Supabase client |
| `apps/web/lib/supabase/server.ts` | Server-side Supabase client |
| `apps/web/middleware.ts` | Session refresh + route protection |
| `apps/web/app/auth/callback/route.ts` | Email confirmation callback |
| `apps/web/app/dashboard/actions.ts` | Sign-out Server Action |

---

## 11. Security Reminders

- The `NEXT_PUBLIC_` prefix means the variable is embedded in browser-delivered JavaScript. This is correct for the Supabase URL and publishable key.
- The `service_role` key must **never** have the `NEXT_PUBLIC_` prefix and must never appear in client-side code.
- Do not add `GEMINI_API_KEY` or any secret key with the `NEXT_PUBLIC_` prefix.
- Never commit `.env.local` — the `.gitignore` already protects this, but verify before any `git push`.

---

*This guide covers Phase 1 (Authentication Foundation) only.
Database schemas, robot pairing, AI integration and deployment will be addressed in subsequent phases.*
