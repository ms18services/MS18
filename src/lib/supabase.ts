import { createClient } from '@supabase/supabase-js';

function getSupabaseConfig(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error('Missing env var: NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)');
  }

  if (!anonKey) {
    throw new Error('Missing env var: NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_ANON_KEY)');
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
