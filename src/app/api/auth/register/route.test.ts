import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth-service', () => ({
  registerUser: vi.fn(),
}));

const { registerUser } = await import('@/lib/auth-service');
const { ConflictError } = await import('@/lib/errors');
const { POST } = await import('./route');

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 201 with the created session on success', async () => {
    vi.mocked(registerUser).mockResolvedValue({
      token: 'tok',
      user: { id: 'u1', email: 'ada@example.com', name: 'Ada' },
    });

    const response = await POST(makeRequest({ email: 'ada@example.com', password: 'password123', name: 'Ada' }));

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      token: 'tok',
      user: { id: 'u1', email: 'ada@example.com', name: 'Ada' },
    });
  });

  it('returns 400 for an invalid payload without calling the service', async () => {
    const response = await POST(makeRequest({ email: 'not-an-email', password: 'short', name: '' }));

    expect(response.status).toBe(400);
    expect((await response.json()).error.message).toBe('Validation error');
    expect(registerUser).not.toHaveBeenCalled();
  });

  it('maps a service ConflictError to a 409 with its message', async () => {
    vi.mocked(registerUser).mockRejectedValue(new ConflictError('Email already in use'));

    const response = await POST(makeRequest({ email: 'ada@example.com', password: 'password123', name: 'Ada' }));

    expect(response.status).toBe(409);
    expect((await response.json()).error.message).toBe('Email already in use');
  });
});
