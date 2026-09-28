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

function makeRequest(method: string, mediaType: string, body?: unknown) {
  return new Request(`http://localhost/api/watchlist/${mediaType}/42`, {
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

function routeParams(mediaType: string, movieId: string) {
  return { params: Promise.resolve({ mediaType, movieId }) };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('DELETE /api/watchlist/[mediaType]/[movieId]', () => {
  it('removes the movie and returns 204', async () => {
    vi.mocked(requireUser).mockResolvedValue(user);
    vi.mocked(removeFromWatchlist).mockResolvedValue(undefined);

    const response = await DELETE(makeRequest('DELETE', 'movie'), routeParams('movie', '42'));

    expect(response.status).toBe(204);
    expect(removeFromWatchlist).toHaveBeenCalledWith('user-1', 42, 'movie');
  });

  it('removes a TV show and returns 204', async () => {
    vi.mocked(requireUser).mockResolvedValue(user);
    vi.mocked(removeFromWatchlist).mockResolvedValue(undefined);

    const response = await DELETE(makeRequest('DELETE', 'tv'), routeParams('tv', '42'));

    expect(response.status).toBe(204);
    expect(removeFromWatchlist).toHaveBeenCalledWith('user-1', 42, 'tv');
  });

  it('returns 404 when the title is not on the watchlist', async () => {
    vi.mocked(requireUser).mockResolvedValue(user);
    vi.mocked(removeFromWatchlist).mockRejectedValue(new NotFoundError('Not in your watchlist'));

    const response = await DELETE(makeRequest('DELETE', 'movie'), routeParams('movie', '42'));

    expect(response.status).toBe(404);
  });

  it('rejects an invalid media type', async () => {
    vi.mocked(requireUser).mockResolvedValue(user);

    const response = await DELETE(makeRequest('DELETE', 'book'), routeParams('book', '42'));

    expect(response.status).toBe(400);
    expect(removeFromWatchlist).not.toHaveBeenCalled();
  });
});

describe('PATCH /api/watchlist/[mediaType]/[movieId]', () => {
  it('updates the rating', async () => {
    vi.mocked(requireUser).mockResolvedValue(user);
    vi.mocked(rateWatchlistItem).mockResolvedValue({ id: 'w1', rating: 4 } as never);

    const response = await PATCH(makeRequest('PATCH', 'movie', { rating: 4 }), routeParams('movie', '42'));

    expect(response.status).toBe(200);
    expect(rateWatchlistItem).toHaveBeenCalledWith('user-1', 42, 'movie', 4);
  });

  it('rejects an out-of-range rating', async () => {
    vi.mocked(requireUser).mockResolvedValue(user);

    const response = await PATCH(makeRequest('PATCH', 'movie', { rating: 7 }), routeParams('movie', '42'));

    expect(response.status).toBe(400);
    expect(rateWatchlistItem).not.toHaveBeenCalled();
  });
});
