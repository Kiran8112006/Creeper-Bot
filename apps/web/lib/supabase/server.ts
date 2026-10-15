import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseConfig } from '@/lib/env';

export async function createClient() {
  const { url, key, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(url!, key!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method is called from a Server Component.
          // Cookies can only be set in middleware or Server Actions / Route Handlers.
        }
      },
    },
  });
}
