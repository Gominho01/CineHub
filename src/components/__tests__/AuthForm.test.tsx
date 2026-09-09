import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

const loginRequest = vi.fn();
const registerRequest = vi.fn();
vi.mock('../../lib/api-client', () => ({
  loginRequest: (...args: unknown[]) => loginRequest(...args),
  registerRequest: (...args: unknown[]) => registerRequest(...args),
}));

const setSession = vi.fn();
vi.mock('../../store/auth', () => ({
  useAuthStore: (selector: (state: { setSession: typeof setSession }) => unknown) => selector({ setSession }),
}));

import { AuthForm } from '../AuthForm';

describe('AuthForm', () => {
  beforeEach(() => {
    push.mockClear();
    loginRequest.mockReset();
    registerRequest.mockReset();
    setSession.mockClear();
  });

  it('renders the login form by default', () => {
    render(<AuthForm />);
    expect(screen.getByRole('heading', { name: /log in to cinehub/i })).toBeInTheDocument();
  });

  it('switches to the register form', () => {
    render(<AuthForm />);
    fireEvent.click(screen.getByRole('button', { name: /need an account/i }));
    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
  });

  it('logs in and redirects to the watchlist on success', async () => {
    loginRequest.mockResolvedValue({ token: 'tok', user: { id: 'u1', email: 'a@b.com', name: 'Ada' } });

    render(<AuthForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /^log in$/i }));

    await waitFor(() => expect(setSession).toHaveBeenCalledWith('tok', { id: 'u1', email: 'a@b.com', name: 'Ada' }));
    expect(push).toHaveBeenCalledWith('/watchlist');
  });

  it('shows the error message from a failed login', async () => {
    loginRequest.mockRejectedValue(new Error('Invalid email or password'));

    render(<AuthForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /^log in$/i }));

    await waitFor(() => expect(screen.getByText('Invalid email or password')).toBeInTheDocument());
    expect(setSession).not.toHaveBeenCalled();
  });
});
