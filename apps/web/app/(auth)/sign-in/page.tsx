'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import CreeperFace from '@/components/ui/CreeperFace';
import { createClient } from '@/lib/supabase/client';
import { getSupabaseConfig } from '@/lib/env';

type FormState = 'idle' | 'loading' | 'error';

export default function SignInPage() {
  const router = useRouter();
  const { isConfigured } = getSupabaseConfig();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState]       = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isConfigured) {
      setErrorMessage(
        'Supabase is not configured. Add your credentials to apps/web/.env.local and restart the server.'
      );
      setFormState('error');
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Please enter your email address and password.');
      setFormState('error');
      return;
    }

    setFormState('loading');
    setErrorMessage('');

    const supabase = createClient();
    if (!supabase) {
      setErrorMessage('Unable to connect to authentication service.');
      setFormState('error');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Use safe, non-leaking error messages
      const message =
        error.message === 'Invalid login credentials'
          ? 'Incorrect email or password. Please try again.'
          : error.message;
      setErrorMessage(message);
      setFormState('error');
      return;
    }

    // Redirect to dashboard on success
    router.push('/dashboard');
    router.refresh();
  }

  const isLoading = formState === 'loading';

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ marginBottom: '16px', display: 'inline-block' }}>
          <CreeperFace size={56} expression="idle" />
        </div>
        <h1
          className="heading-pixel"
          style={{ fontSize: '12px', color: 'var(--color-grass-light)', marginBottom: '8px' }}
        >
          SIGN IN
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#888888' }}>
          Welcome back, Operator.
        </p>
      </div>

      {/* Configuration warning */}
      {!isConfigured && (
        <div
          className="badge badge-error"
          style={{
            display: 'flex',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '11px',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.6,
          }}
        >
          <span style={{ flexShrink: 0 }}>⚠</span>
          <span>
            Supabase is not configured. Authentication will not work until credentials are added to{' '}
            <code
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '9px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '2px 4px',
              }}
            >
              apps/web/.env.local
            </code>
            .
          </span>
        </div>
      )}

      {/* Form panel */}
      <div className="block-panel" style={{ padding: '28px' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email */}
            <div>
              <label htmlFor="signin-email" className="mc-label">
                EMAIL ADDRESS
              </label>
              <input
                id="signin-email"
                type="email"
                className={`mc-input${formState === 'error' ? ' error' : ''}`}
                placeholder="steve@minecraft.net"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFormState('idle'); }}
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signin-password" className="mc-label">
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`mc-input${formState === 'error' ? ' error' : ''}`}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFormState('idle'); }}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  id="signin-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#777777',
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '7px',
                    padding: '4px',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {/* Error message */}
            {formState === 'error' && errorMessage && (
              <div
                className="badge badge-error"
                style={{
                  display: 'flex',
                  padding: '10px 14px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-body)',
                  lineHeight: 1.5,
                }}
              >
                <span>⚠</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit */}
            <button
              id="signin-submit-btn"
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', marginTop: '4px' }}
            >
              {isLoading ? (
                <>
                  <span className="animate-blink">■</span>
                  SIGNING IN...
                </>
              ) : (
                '⚡ SIGN IN'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Register link */}
      <p
        style={{
          textAlign: 'center',
          marginTop: '20px',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: '#777777',
        }}
      >
        No account yet?{' '}
        <Link
          href="/sign-up"
          style={{ color: 'var(--color-grass-light)', textDecoration: 'none' }}
        >
          Create one →
        </Link>
      </p>
    </div>
  );
}
