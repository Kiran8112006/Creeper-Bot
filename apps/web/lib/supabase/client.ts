import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseConfig } from '@/lib/env';

export function createClient() {
  const { url, key, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    // Return null — callers must guard against this when credentials are absent.
    // The public landing page never calls this; only auth pages do.
    return null;
  }

  return createBrowserClient(url!, key!);
}
