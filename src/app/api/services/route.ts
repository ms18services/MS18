import { NextResponse } from 'next/server';

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function GET() {
  try {
    const baseUrl = (process.env.BACKEND_BASE_URL ?? 'http://localhost:5055').replace(/\/$/, '');
    const sharedSecret = requireEnv('BACKEND_SHARED_SECRET');

    const res = await fetch(`${baseUrl}/api/services`, {
      method: 'GET',
      headers: {
        'x-backend-secret': sharedSecret,
      },
      cache: 'no-store',
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Failed to load services' }, { status: 500 });
  }
}
