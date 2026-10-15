import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseConfig } from '@/lib/env';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code  = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const next  = requestUrl.searchParams.get('next') ?? '/dashboard';

  // If Supabase returned an OAuth/email-link error, redirect to sign-in with context
  if (error) {
    const signInUrl = new URL('/sign-in', requestUrl.origin);
    signInUrl.searchParams.set('error', error);
    return NextResponse.redirect(signInUrl);
  }

  if (!code) {
    // No code present — likely a direct visit; redirect home
    return NextResponse.redirect(new URL('/', requestUrl.origin));
  }

  const { url, key, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    // Auth cannot complete without credentials — redirect with explanation
    const signInUrl = new URL('/sign-in', requestUrl.origin);
    signInUrl.searchParams.set('error', 'supabase_not_configured');
    return NextResponse.redirect(signInUrl);
  }

  // Exchange the code for a session
  const response = NextResponse.redirect(new URL(next, requestUrl.origin));

  const supabase = createServerClient(url!, key!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    const signInUrl = new URL('/sign-in', requestUrl.origin);
    signInUrl.searchParams.set('error', exchangeError.message);
    return NextResponse.redirect(signInUrl);
  }

  return response;
}
