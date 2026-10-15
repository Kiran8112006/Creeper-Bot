'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';

import CreeperFace from '@/components/ui/CreeperFace';
import { createClient } from '@/lib/supabase/client';
import { getSupabaseConfig } from '@/lib/env';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function SignUpPage() {

  const { isConfigured } = getSupabaseConfig();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [confirm, setConfirm]           = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [formState, setFormState]       = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Client-side validation
  function validate(): string | null {
    if (!email.trim())         return 'Email address is required.';
    if (!email.includes('@'))  return 'Please enter a valid email address.';
    if (password.length < 8)   return 'Password must be at least 8 characters.';
    if (password !== confirm)  return 'Passwords do not match.';
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isConfigured) {
      setErrorMessage(
        'Supabase is not configured. Add your project credentials to apps/web/.env.local and restart the server.'
      );
      setFormState('error');
      return;
    }

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setFormState('error');
      return;
    }

    // Supabase may require email confirmation depending on project settings.
    // We always show the confirmation message rather than assuming an active session.
    setSuccessMessage(
      'Account created! Check your email for a confirmation link. Once confirmed, sign in to access your dashboard.'
    );
    setFormState('success');
  }

  const isLoading = formState === 'loading';

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ marginBottom: '16px', display: 'inline-block' }}>
          <CreeperFace size={56} expression="happy" animated />
        </div>
        <h1
          className="heading-pixel"
          style={{ fontSize: '12px', color: 'var(--color-grass-light)', marginBottom: '8px' }}
        >
          CREATE ACCOUNT
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#888888' }}>
          Join the world. Claim your CreeperBot.
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
            Supabase is not configured. Authentication will not work until you add your credentials to{' '}
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
            . See{' '}
            <Link href="/docs/credentials-setup" style={{ color: 'var(--color-redstone-light)' }}>
              credentials-setup.md
            </Link>{' '}
            for instructions.
          </span>
        </div>
      )}

      {/* Form panel */}
      <div className="block-panel" style={{ padding: '28px' }}>
        {formState === 'success' ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CreeperFace size={48} expression="happy" animated />
            <div
              className="heading-pixel"
              style={{ fontSize: '9px', color: 'var(--color-emerald-light)', margin: '16px 0 12px' }}
            >
              CHECK YOUR EMAIL
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#AAAAAA', lineHeight: 1.7 }}>
              {successMessage}
            </p>
            <Link href="/sign-in" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-flex' }}>
              GO TO SIGN IN
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Email */}
              <div>
                <label htmlFor="signup-email" className="mc-label">
                  EMAIL ADDRESS
                </label>
                <input
                  id="signup-email"
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
                <label htmlFor="signup-password" className="mc-label">
                  PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`mc-input${formState === 'error' ? ' error' : ''}`}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setFormState('idle'); }}
                    required
                    autoComplete="new-password"
                    disabled={isLoading}
                    style={{ paddingRight: '48px' }}
                  />
                  <button
                    type="button"
                    id="signup-toggle-password"
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

              {/* Confirm password */}
              <div>
                <label htmlFor="signup-confirm" className="mc-label">
                  CONFIRM PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="signup-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    className={`mc-input${formState === 'error' ? ' error' : ''}`}
                    placeholder="Repeat your password"
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setFormState('idle'); }}
                    required
                    autoComplete="new-password"
                    disabled={isLoading}
                    style={{ paddingRight: '48px' }}
                  />
                  <button
                    type="button"
                    id="signup-toggle-confirm"
                    onClick={() => setShowConfirm(!showConfirm)}
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
                    aria-label={showConfirm ? 'Hide confirmation' : 'Show confirmation'}
                  >
                    {showConfirm ? 'HIDE' : 'SHOW'}
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
                id="signup-submit-btn"
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{ width: '100%', marginTop: '4px' }}
              >
                {isLoading ? (
                  <>
                    <span className="animate-blink">■</span>
                    CREATING ACCOUNT...
                  </>
                ) : (
                  '⚡ CREATE ACCOUNT'
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Sign-in link */}
      {formState !== 'success' && (
        <p
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: '#777777',
          }}
        >
          Already have an account?{' '}
          <Link
            href="/sign-in"
            style={{ color: 'var(--color-grass-light)', textDecoration: 'none' }}
          >
            Sign in →
          </Link>
        </p>
      )}
    </div>
  );
}
