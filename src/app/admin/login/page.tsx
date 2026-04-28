'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') ?? '/admin';

  const [email, setEmail] = useState('ms18@admin888.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: from,
    });

    setLoading(false);

    if (!res || res.error) {
      setError('Invalid email or password.');
      return;
    }

    window.location.href = res.url ?? from;
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto w-full max-w-md px-6 pt-16 pb-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Login</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Sign in to manage Journal posts. 
        </p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          {error ? <div className="text-sm font-semibold text-red-600">{error}</div> : null}

          <label className="grid gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</span>
            <input
              className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-slate-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Password</span>
            <input
              className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-slate-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-11 rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </div>
  );
}
