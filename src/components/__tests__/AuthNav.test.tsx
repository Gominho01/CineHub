import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const { authState } = vi.hoisted(() => ({
  authState: {
    user: null as { id: string; email: string; name: string } | null,
    logout: vi.fn(),
  },
}));

vi.mock('../../store/auth', () => ({
  useAuthStore: (selector: (state: typeof authState) => unknown) => selector(authState),
}));

import { AuthNav } from '../AuthNav';

describe('AuthNav', () => {
  it('shows a login link when logged out', () => {
    authState.user = null;
    render(<AuthNav />);
    expect(screen.getByRole('link', { name: /log in/i })).toHaveAttribute('href', '/login');
  });

  it('shows watchlist and logout when logged in', () => {
    authState.user = { id: 'u1', email: 'a@b.com', name: 'Ada' };
    render(<AuthNav />);

    expect(screen.getByRole('link', { name: /watchlist/i })).toHaveAttribute('href', '/watchlist');

    fireEvent.click(screen.getByRole('button', { name: /log out/i }));
    expect(authState.logout).toHaveBeenCalled();
  });
});
