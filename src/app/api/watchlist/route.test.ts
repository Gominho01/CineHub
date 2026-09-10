import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  requireUser: vi.fn(),
}));
vi.mock('@/lib/watchlist-service', () => ({
  listWatchlist: vi.fn(),
  addToWatchlist: vi.fn(),
}));

const { requireUser } = await import('@/lib/auth');
const { listWatchlist, addToWatchlist } = await import('@/lib/watchlist-service');
const { ConflictError, UnauthorizedError } = await import('@/lib/errors');
const { GET, POST } = await import('./route');

const user = { id: 'user-1', email: 'ada@example.com', name: 'Ada' };

function makeRequest(method: string, body?: unknown) {
  return new Request('http://localhost/api/watchlist', {
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/watchlist', () => {
  it("returns the caller's watchlist", async () => {
    vi.mocked(requireUser).mockResolvedValue(user);
    vi.mocked(listWatchlist).mockResolvedValue([{ id: 'w1' } as never]);

    const response = await GET(makeRequest('GET'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([{ id: 'w1' }]);
    expect(listWatchlist).toHaveBeenCalledWith('user-1');
  });

  it('returns 401 when unauthenticated', async () => {
    vi.mocked(requireUser).mockRejectedValue(new UnauthorizedError('Missing or invalid Authorization header'));

    const response = await GET(makeRequest('GET'));

    expect(response.status).toBe(401);
  });
});

describe('POST /api/watchlist', () => {
  it('adds a movie and returns 201', async () => {
    vi.mocked(requireUser).mockResolvedValue(user);
    vi.mocked(addToWatchlist).mockResolvedValue({ id: 'w1', movieId: 42 } as never);

    const response = await POST(
      makeRequest('POST', { movieId: 42, title: 'Dune', posterPath: '/dune.jpg', genreIds: [878] }),
    );

    expect(response.status).toBe(201);
    expect(addToWatchlist).toHaveBeenCalledWith('user-1', {
      movieId: 42,
      title: 'Dune',
      posterPath: '/dune.jpg',
      genreIds: [878],
    });
  });

  it('returns 409 when the movie is already on the watchlist', async () => {
    vi.mocked(requireUser).mockResolvedValue(user);
    vi.mocked(addToWatchlist).mockRejectedValue(new ConflictError('Already in your watchlist'));

    const response = await POST(makeRequest('POST', { movieId: 42, title: 'Dune' }));

    expect(response.status).toBe(409);
  });

  it('returns 400 for an invalid payload', async () => {
    vi.mocked(requireUser).mockResolvedValue(user);

    const response = await POST(makeRequest('POST', { movieId: -1, title: '' }));

    expect(response.status).toBe(400);
    expect(addToWatchlist).not.toHaveBeenCalled();
  });
});
