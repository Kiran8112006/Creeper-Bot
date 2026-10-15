'use client';

import { useActionState, useEffect, useRef } from 'react';
import { updateProfile } from '@/app/dashboard/actions';
import type { Profile } from '@/lib/types/database';

const INITIAL_STATE = { error: null as string | null, success: false };

export default function ProfileEditForm({ profile }: { profile: Profile | null }) {
  const [state, formAction, isPending] = useActionState(updateProfile, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && formRef.current) {
      // Clear the input after successful save
      const input = formRef.current.querySelector<HTMLInputElement>('[name="display_name"]');
      if (input) input.value = '';
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <label htmlFor="profile-display-name" className="mc-label">
          DISPLAY NAME
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            id="profile-display-name"
            name="display_name"
            type="text"
            className={`mc-input${state.error ? ' error' : ''}`}
            defaultValue={profile?.display_name ?? ''}
            placeholder="Enter a display name…"
            maxLength={64}
            disabled={isPending}
            style={{ flex: 1, minWidth: '180px' }}
          />
          <button
            id="profile-save-btn"
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={isPending}
            style={{ whiteSpace: 'nowrap' }}
          >
            {isPending ? (
              <>
                <span className="animate-blink">■</span> SAVING…
              </>
            ) : (
              'SAVE NAME'
            )}
          </button>
        </div>
      </div>

      {state.error && (
        <div
          className="badge badge-error"
          style={{
            display: 'flex',
            padding: '8px 12px',
            fontSize: '12px',
            fontFamily: 'var(--font-body)',
          }}
        >
          <span>⚠</span>
          <span>{state.error}</span>
        </div>
      )}

      {state.success && (
        <div
          className="badge badge-online"
          style={{
            display: 'flex',
            padding: '8px 12px',
            fontSize: '12px',
            fontFamily: 'var(--font-body)',
          }}
        >
          <span>✓</span>
          <span>Display name saved.</span>
        </div>
      )}
    </form>
  );
}
