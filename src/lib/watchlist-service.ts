import { prisma } from './prisma';
import { ConflictError, NotFoundError } from './errors';

export function listWatchlist(userId: string) {
  return prisma.watchlistItem.findMany({ where: { userId }, orderBy: { addedAt: 'desc' } });
}

export interface AddWatchlistItemParams {
  movieId: number;
  title: string;
  posterPath?: string | null;
}

export async function addToWatchlist(userId: string, data: AddWatchlistItemParams) {
  const existing = await prisma.watchlistItem.findUnique({
    where: { userId_movieId: { userId, movieId: data.movieId } },
  });
  if (existing) {
    throw new ConflictError('Already in your watchlist');
  }

  return prisma.watchlistItem.create({
    data: {
      userId,
      movieId: data.movieId,
      title: data.title,
      posterPath: data.posterPath ?? null,
    },
  });
}

async function findOwnItem(userId: string, movieId: number) {
  const item = await prisma.watchlistItem.findUnique({ where: { userId_movieId: { userId, movieId } } });
  if (!item) {
    throw new NotFoundError('Not in your watchlist');
  }
  return item;
}

export async function removeFromWatchlist(userId: string, movieId: number): Promise<void> {
  const item = await findOwnItem(userId, movieId);
  await prisma.watchlistItem.delete({ where: { id: item.id } });
}

export async function rateWatchlistItem(userId: string, movieId: number, rating: number | null) {
  const item = await findOwnItem(userId, movieId);
  return prisma.watchlistItem.update({ where: { id: item.id }, data: { rating } });
}
