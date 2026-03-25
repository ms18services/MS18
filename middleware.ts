import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ADMIN_EMAIL_ALLOWLIST = new Set(['ms18@admin888.com']);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const email = typeof token?.email === 'string' ? token.email.toLowerCase() : '';

  if (!email || !ADMIN_EMAIL_ALLOWLIST.has(email)) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
