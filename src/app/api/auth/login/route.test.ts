import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth-service', () => ({
  loginUser: vi.fn(),
}));

const { loginUser } = await import('@/lib/auth-service');
const { UnauthorizedError } = await import('@/lib/errors');
const { POST } = await import('./route');

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with the session on success', async () => {
    vi.mocked(loginUser).mockResolvedValue({
      token: 'tok',
      user: { id: 'u1', email: 'ada@example.com', name: 'Ada' },
    });

    const response = await POST(makeRequest({ email: 'ada@example.com', password: 'password123' }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      token: 'tok',
      user: { id: 'u1', email: 'ada@example.com', name: 'Ada' },
    });
  });

  it('maps invalid credentials to a 401 with the service message', async () => {
    vi.mocked(loginUser).mockRejectedValue(new UnauthorizedError('Invalid email or password'));

    const response = await POST(makeRequest({ email: 'ada@example.com', password: 'wrong' }));

    expect(response.status).toBe(401);
    expect((await response.json()).error.message).toBe('Invalid email or password');
  });
});
