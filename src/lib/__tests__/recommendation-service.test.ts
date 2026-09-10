import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../prisma', () => ({
  prisma: {
    watchlistItem: {
      findMany: vi.fn(),
    },
  },
}));
vi.mock('../tmdb', () => ({
  getMoviesByGenre: vi.fn(),
  getTopRatedPopular: vi.fn(),
}));

const { prisma } = await import('../prisma');
const { getMoviesByGenre, getTopRatedPopular } = await import('../tmdb');
const { getRecommendations } = await import('../recommendation-service');

describe('getRecommendations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('falls back to popular, highly-rated movies for an empty watchlist', async () => {
    vi.mocked(prisma.watchlistItem.findMany).mockResolvedValue([]);
    vi.mocked(getTopRatedPopular).mockResolvedValue({
      page: 1,
      results: [{ id: 2, title: 'The Shawshank Redemption' }] as never,
      total_pages: 1,
      total_results: 1,
    });

    const result = await getRecommendations('user-1');

    expect(result).toEqual({
      genreId: null,
      basis: 'popular',
      movies: [{ id: 2, title: 'The Shawshank Redemption' }],
    });
    expect(getMoviesByGenre).not.toHaveBeenCalled();
  });

  it('recommends movies from the most frequent genre across the watchlist', async () => {
    vi.mocked(prisma.watchlistItem.findMany).mockResolvedValue([
      { genreIds: [878, 12] },
      { genreIds: [878] },
      { genreIds: [35] },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any);
    vi.mocked(getMoviesByGenre).mockResolvedValue({
      page: 1,
      results: [{ id: 1, title: 'Dune' }] as never,
      total_pages: 1,
      total_results: 1,
    });

    const result = await getRecommendations('user-1');

    // 878 (sci-fi) appears twice, more than any other genre.
    expect(getMoviesByGenre).toHaveBeenCalledWith('878');
    expect(result).toEqual({ genreId: 878, basis: 'genre', movies: [{ id: 1, title: 'Dune' }] });
  });

  it('ignores watchlist items with no genres recorded', async () => {
    vi.mocked(prisma.watchlistItem.findMany).mockResolvedValue([
      { genreIds: [] },
      { genreIds: [] },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any);
    vi.mocked(getTopRatedPopular).mockResolvedValue({
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    });

    const result = await getRecommendations('user-1');

    expect(result).toEqual({ genreId: null, basis: 'popular', movies: [] });
    expect(getMoviesByGenre).not.toHaveBeenCalled();
  });

  it('falls back to popular, highly-rated movies for an anonymous visitor', async () => {
    vi.mocked(getTopRatedPopular).mockResolvedValue({
      page: 1,
      results: [{ id: 2, title: 'The Shawshank Redemption' }] as never,
      total_pages: 1,
      total_results: 1,
    });

    const result = await getRecommendations(null);

    expect(result).toEqual({
      genreId: null,
      basis: 'popular',
      movies: [{ id: 2, title: 'The Shawshank Redemption' }],
    });
    expect(prisma.watchlistItem.findMany).not.toHaveBeenCalled();
  });
});
