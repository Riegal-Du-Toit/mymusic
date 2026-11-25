import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

function isPublicKey(value: string): boolean {
  if (value.startsWith('sb_publishable_')) return true;
  try {
    const payload = JSON.parse(atob(value.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.role === 'anon';
  } catch { return false; }
}

export const supabaseConfigError = !/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)
  ? 'Set a valid Supabase project URL in .env.local.'
  : !isPublicKey(key) ? 'Set a Supabase publishable or anon key in .env.local.' : null;

export const supabase = supabaseConfigError ? null : createClient(url, key);

export async function checkSupabaseConnection(): Promise<void> {
  if (!supabase) throw new Error(supabaseConfigError ?? 'Supabase is not configured.');
  const response = await fetch(`${url.replace(/\/$/, '')}/auth/v1/health`, {
    headers: { apikey: key },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Supabase returned HTTP ${response.status}.`);
}
