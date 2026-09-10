import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  getOptionalUser: vi.fn(),
}));
vi.mock('@/lib/recommendation-service', () => ({
  getRecommendations: vi.fn(),
}));

const { getOptionalUser } = await import('@/lib/auth');
const { getRecommendations } = await import('@/lib/recommendation-service');
const { GET } = await import('./route');

const user = { id: 'user-1', email: 'ada@example.com', name: 'Ada' };

function makeRequest() {
  return new Request('http://localhost/api/recommendations');
}

describe('GET /api/recommendations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the caller's recommendations when logged in", async () => {
    vi.mocked(getOptionalUser).mockResolvedValue(user);
    vi.mocked(getRecommendations).mockResolvedValue({ genreId: 878, basis: 'genre', movies: [] });

    const response = await GET(makeRequest());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ genreId: 878, basis: 'genre', movies: [] });
    expect(getRecommendations).toHaveBeenCalledWith('user-1');
  });

  it('falls back to the popular/top-rated list for an anonymous visitor', async () => {
    vi.mocked(getOptionalUser).mockResolvedValue(null);
    vi.mocked(getRecommendations).mockResolvedValue({ genreId: null, basis: 'popular', movies: [] });

    const response = await GET(makeRequest());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ genreId: null, basis: 'popular', movies: [] });
    expect(getRecommendations).toHaveBeenCalledWith(null);
  });
});
