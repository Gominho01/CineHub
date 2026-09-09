'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { loginRequest, registerRequest } from '../lib/api-client';
import { useAuthStore } from '../store/auth';

export function AuthForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result =
        mode === 'login' ? await loginRequest(email, password) : await registerRequest(email, password, name);
      setSession(result.token, result.user);
      router.push('/watchlist');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4">
      <h1 className="text-2xl font-semibold">{mode === 'login' ? 'Log in to CineHub' : 'Create your account'}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === 'register' && (
          <label className="flex flex-col gap-1 text-sm">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
          </label>
        )}

        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
        >
          {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Register'}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError(null);
          }}
          className="text-sm text-white/60 underline"
        >
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Log in'}
        </button>
      </form>
    </div>
  );
}
