import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ADMIN_EMAIL_ALLOWLIST = new Set(['ms18@admin888.com']);

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function requireAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const email = typeof token?.email === 'string' ? token.email.toLowerCase() : '';
  if (!email || !ADMIN_EMAIL_ALLOWLIST.has(email)) {
    return null;
  }
  return token;
}

async function forwardToBackend(req: NextRequest) {
  const baseUrl = (process.env.BACKEND_BASE_URL ?? 'http://localhost:5055').replace(/\/$/, '');
  const sharedSecret = requireEnv('BACKEND_SHARED_SECRET');
  const url = `${baseUrl}/api/services`;

  const headers: Record<string, string> = {
    'x-backend-secret': sharedSecret,
  };

  let body: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.text();
    headers['Content-Type'] = req.headers.get('content-type') ?? 'application/json';
  }

  const res = await fetch(url, {
    method: req.method,
    headers,
    body,
    cache: 'no-store',
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('content-type') ?? 'application/json',
    },
  });
}

export async function GET(req: NextRequest) {
  const token = await requireAdmin(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    return await forwardToBackend(req);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Failed to load services' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = await requireAdmin(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    return await forwardToBackend(req);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Failed to save services' }, { status: 500 });
  }
}
