// Environment variable validation
// Call this to check if Supabase is configured WITHOUT printing secrets.

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return {
    isConfigured: Boolean(url && key),
    url: url ?? null,
    key: key ?? null,
  };
}

export function requireSupabaseConfig() {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables. ' +
        'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in apps/web/.env.local'
    );
  }
  return { url, key };
}
