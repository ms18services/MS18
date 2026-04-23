import { createClient } from '@supabase/supabase-js';

function normalizeEnvValue(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

export function getSupabaseConfig(): { url: string; anonKey: string } {
  const url = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL);
  const anonKey = normalizeEnvValue(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.SUPABASE_PUBLISHABLE_KEY
  );

  if (!url) {
    throw new Error('Missing env var: NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)');
  }

  if (!anonKey) {
    throw new Error(
      'Missing Supabase client key: NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, or SUPABASE_PUBLISHABLE_KEY'
    );
  }

  return { url, anonKey };
}

export const JOURNAL_IMAGES_BUCKET = 'journal-images';
export const SERVICE_IMAGES_BUCKET = 'service-images';

export function createSupabaseAnonClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createClient(url, anonKey);
}

export function createSupabaseUserClient(accessToken: string) {
  const { url, anonKey } = getSupabaseConfig();
  return createClient(url, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}
