import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  requireUser: vi.fn(),
}));
vi.mock('@/lib/watchlist-service', () => ({
  removeFromWatchlist: vi.fn(),
  rateWatchlistItem: vi.fn(),
}));

const { requireUser } = await import('@/lib/auth');
const { removeFromWatchlist, rateWatchlistItem } = await import('@/lib/watchlist-service');
const { NotFoundError } = await import('@/lib/errors');
const { DELETE, PATCH } = await import('./route');

const user = { id: 'user-1', email: 'ada@example.com', name: 'Ada' };

function makeRequest(method: string, body?: unknown) {
  return new Request('http://localhost/api/watchlist/42', {
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

function routeParams(movieId: string) {
  return { params: Promise.resolve({ movieId }) };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('DELETE /api/watchlist/[movieId]', () => {
  it('removes the movie and returns 204', async () => {
    vi.mocked(requireUser).mockResolvedValue(user);
    vi.mocked(removeFromWatchlist).mockResolvedValue(undefined);

    const response = await DELETE(makeRequest('DELETE'), routeParams('42'));

    expect(response.status).toBe(204);
    expect(removeFromWatchlist).toHaveBeenCalledWith('user-1', 42);
  });

  it('returns 404 when the movie is not on the watchlist', async () => {
    vi.mocked(requireUser).mockResolvedValue(user);
    vi.mocked(removeFromWatchlist).mockRejectedValue(new NotFoundError('Not in your watchlist'));

    const response = await DELETE(makeRequest('DELETE'), routeParams('42'));

    expect(response.status).toBe(404);
  });
});

describe('PATCH /api/watchlist/[movieId]', () => {
  it('updates the rating', async () => {
    vi.mocked(requireUser).mockResolvedValue(user);
    vi.mocked(rateWatchlistItem).mockResolvedValue({ id: 'w1', rating: 4 } as never);

    const response = await PATCH(makeRequest('PATCH', { rating: 4 }), routeParams('42'));

    expect(response.status).toBe(200);
    expect(rateWatchlistItem).toHaveBeenCalledWith('user-1', 42, 4);
  });

  it('rejects an out-of-range rating', async () => {
    vi.mocked(requireUser).mockResolvedValue(user);

    const response = await PATCH(makeRequest('PATCH', { rating: 7 }), routeParams('42'));

    expect(response.status).toBe(400);
    expect(rateWatchlistItem).not.toHaveBeenCalled();
  });
});
