import NextAuth from 'next-auth';
import type { Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '@/lib/supabase';

const { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY } = getSupabaseConfig();

const ADMIN_EMAIL_ALLOWLIST = new Set([
  'ms18@admin888.com',
]);

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type SupabaseUser = User & {
  id: string;
  email?: string | null;
  supabaseAccessToken?: string;
  supabaseRefreshToken?: string;
  supabaseExpiresAt?: number;
};

type SupabaseJwt = JWT & {
  supabaseAccessToken?: string;
  supabaseRefreshToken?: string;
  supabaseExpiresAt?: number;
  supabaseRefreshError?: string;
};

type SupabaseSession = Session & {
  supabaseAccessToken?: string;
  supabaseRefreshError?: string;
};

function getJwtExpMs(jwt?: string) {
  if (!jwt) return null;
  const parts = jwt.split('.');
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf8')) as { exp?: number };
    if (!payload?.exp) return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
}

const handler = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) return null;
        if (!ADMIN_EMAIL_ALLOWLIST.has(email)) return null;

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !data.user || !data.session) return null;

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.email,
          supabaseAccessToken: data.session.access_token,
          supabaseRefreshToken: data.session.refresh_token,
          supabaseExpiresAt: data.session.expires_at,
        } satisfies SupabaseUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const nextToken = token as SupabaseJwt;
      const nextUser = user as SupabaseUser | undefined;

      if (user) {
        nextToken.email = nextUser?.email ?? undefined;
        nextToken.sub = nextUser?.id;
        nextToken.supabaseAccessToken = nextUser?.supabaseAccessToken;
        nextToken.supabaseRefreshToken = nextUser?.supabaseRefreshToken;
        nextToken.supabaseExpiresAt = nextUser?.supabaseExpiresAt;
        nextToken.supabaseRefreshError = undefined;
      }

      const accessToken = nextToken.supabaseAccessToken;
      const refreshToken = nextToken.supabaseRefreshToken;
      const expMs = nextToken.supabaseExpiresAt
        ? nextToken.supabaseExpiresAt * 1000
        : getJwtExpMs(accessToken);

      if (accessToken && refreshToken && expMs) {
        const shouldRefresh = Date.now() > expMs - 60_000;
        if (shouldRefresh) {
          const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
          if (!error && data?.session?.access_token) {
            nextToken.supabaseAccessToken = data.session.access_token;
            nextToken.supabaseRefreshToken = data.session.refresh_token;
            nextToken.supabaseExpiresAt = data.session.expires_at;
            nextToken.supabaseRefreshError = undefined;
          } else {
            nextToken.supabaseRefreshError = error?.message || 'Unable to refresh Supabase session';
          }
        }
      }

      return nextToken;
    },
    async session({ session, token }) {
      const nextSession = session as SupabaseSession;
      const nextToken = token as SupabaseJwt;

      if (session.user) {
        session.user.email = token.email as string;
      }
      nextSession.supabaseAccessToken = nextToken.supabaseAccessToken;
      nextSession.supabaseRefreshError = nextToken.supabaseRefreshError;
      return nextSession;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
});

export { handler as GET, handler as POST };
