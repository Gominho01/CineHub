'use client';

import Link from 'next/link';
import { useAuthStore } from '../store/auth';

export function AuthNav() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (!user) {
    return (
      <Link href="/login" className="hover:text-white">
        Log in
      </Link>
    );
  }

  return (
    <>
      <Link href="/watchlist" className="hover:text-white">
        Watchlist
      </Link>
      <button type="button" onClick={logout} className="hover:text-white">
        Log out
      </button>
    </>
  );
}
