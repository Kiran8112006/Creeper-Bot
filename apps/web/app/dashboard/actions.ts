'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { updateDisplayName } from '@/lib/data/dashboard';

export async function signOut() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect('/');
}

export async function updateProfile(
  _prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const supabase = await createClient();
  if (!supabase) {
    return { error: 'Authentication service not configured.', success: false };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Not authenticated.', success: false };
  }

  const displayName = formData.get('display_name');
  if (typeof displayName !== 'string') {
    return { error: 'Invalid input.', success: false };
  }

  const result = await updateDisplayName(supabase, user.id, displayName);

  if (result.error) {
    return { error: result.error, success: false };
  }

  revalidatePath('/dashboard');
  return { error: null, success: true };
}
