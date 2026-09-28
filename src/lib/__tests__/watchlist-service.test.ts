import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../prisma', () => ({
  prisma: {
    watchlistItem: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const { prisma } = await import('../prisma');
const { addToWatchlist, listWatchlist, rateWatchlistItem, removeFromWatchlist } = await import(
  '../watchlist-service'
);
const { ConflictError, NotFoundError } = await import('../errors');

describe('watchlist service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists a watchlist ordered by most recently added', async () => {
    vi.mocked(prisma.watchlistItem.findMany).mockResolvedValue([]);

    await listWatchlist('user-1');

    expect(prisma.watchlistItem.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: { addedAt: 'desc' },
    });
  });

  it('adds a movie to the watchlist', async () => {
    vi.mocked(prisma.watchlistItem.findUnique).mockResolvedValue(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.watchlistItem.create).mockResolvedValue({ id: 'w1' } as any);

    await addToWatchlist('user-1', {
      movieId: 42,
      mediaType: 'movie',
      title: 'Dune',
      posterPath: '/dune.jpg',
      genreIds: [878, 12],
    });

    expect(prisma.watchlistItem.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        movieId: 42,
        mediaType: 'movie',
        title: 'Dune',
        posterPath: '/dune.jpg',
        genreIds: [878, 12],
      },
    });
  });

  it('adds a TV show to the watchlist under its own media type', async () => {
    vi.mocked(prisma.watchlistItem.findUnique).mockResolvedValue(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.watchlistItem.create).mockResolvedValue({ id: 'w2' } as any);

    await addToWatchlist('user-1', { movieId: 42, mediaType: 'tv', title: 'Severance', posterPath: null });

    expect(prisma.watchlistItem.findUnique).toHaveBeenCalledWith({
      where: { userId_movieId_mediaType: { userId: 'user-1', movieId: 42, mediaType: 'tv' } },
    });
  });

  it('rejects adding a movie that is already on the watchlist', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.watchlistItem.findUnique).mockResolvedValue({ id: 'w1' } as any);

    await expect(
      addToWatchlist('user-1', { movieId: 42, mediaType: 'movie', title: 'Dune', posterPath: null }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('removes a movie from the watchlist', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.watchlistItem.findUnique).mockResolvedValue({ id: 'w1' } as any);

    await removeFromWatchlist('user-1', 42, 'movie');

    expect(prisma.watchlistItem.delete).toHaveBeenCalledWith({ where: { id: 'w1' } });
  });

  it('rejects removing a movie that is not on the watchlist', async () => {
    vi.mocked(prisma.watchlistItem.findUnique).mockResolvedValue(null);

    await expect(removeFromWatchlist('user-1', 42, 'movie')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('rates a movie already on the watchlist', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.watchlistItem.findUnique).mockResolvedValue({ id: 'w1' } as any);

    await rateWatchlistItem('user-1', 42, 'movie', 4);

    expect(prisma.watchlistItem.update).toHaveBeenCalledWith({ where: { id: 'w1' }, data: { rating: 4 } });
  });

  it('rejects rating a movie that is not on the watchlist', async () => {
    vi.mocked(prisma.watchlistItem.findUnique).mockResolvedValue(null);

    await expect(rateWatchlistItem('user-1', 42, 'movie', 4)).rejects.toBeInstanceOf(NotFoundError);
  });
});
