import { prisma } from './prisma';
import { ConflictError, NotFoundError } from './errors';

export type MediaType = 'movie' | 'tv';

export function listWatchlist(userId: string) {
  return prisma.watchlistItem.findMany({ where: { userId }, orderBy: { addedAt: 'desc' } });
}

export interface AddWatchlistItemParams {
  movieId: number;
  mediaType: MediaType;
  title: string;
  posterPath?: string | null;
  genreIds?: number[];
}

export async function addToWatchlist(userId: string, data: AddWatchlistItemParams) {
  const existing = await prisma.watchlistItem.findUnique({
    where: { userId_movieId_mediaType: { userId, movieId: data.movieId, mediaType: data.mediaType } },
  });
  if (existing) {
    throw new ConflictError('Already in your watchlist');
  }

  return prisma.watchlistItem.create({
    data: {
      userId,
      movieId: data.movieId,
      mediaType: data.mediaType,
      title: data.title,
      posterPath: data.posterPath ?? null,
      genreIds: data.genreIds ?? [],
    },
  });
}

async function findOwnItem(userId: string, movieId: number, mediaType: MediaType) {
  const item = await prisma.watchlistItem.findUnique({
    where: { userId_movieId_mediaType: { userId, movieId, mediaType } },
  });
  if (!item) {
    throw new NotFoundError('Not in your watchlist');
  }
  return item;
}

export async function removeFromWatchlist(userId: string, movieId: number, mediaType: MediaType): Promise<void> {
  const item = await findOwnItem(userId, movieId, mediaType);
  await prisma.watchlistItem.delete({ where: { id: item.id } });
}

export async function rateWatchlistItem(
  userId: string,
  movieId: number,
  mediaType: MediaType,
  rating: number | null,
) {
  const item = await findOwnItem(userId, movieId, mediaType);
  return prisma.watchlistItem.update({ where: { id: item.id }, data: { rating } });
}
