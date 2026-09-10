import { prisma } from './prisma';
import { getMoviesByGenre, getTopRatedPopular } from './tmdb';
import type { Movie } from '@/types/tmdb';

export interface Recommendations {
  genreId: number | null;
  basis: 'genre' | 'popular';
  movies: Movie[];
}

function mostFrequentGenre(genreIdLists: number[][]): number | null {
  const counts = new Map<number, number>();
  for (const genreIds of genreIdLists) {
    for (const genreId of genreIds) {
      counts.set(genreId, (counts.get(genreId) ?? 0) + 1);
    }
  }

  if (counts.size === 0) return null;

  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

/** "Because you watched X" — computed from the most frequent genre across
 * the whole watchlist rather than any single title, since that's the only
 * signal cheap enough to keep in sync without re-fetching every watchlist
 * title from TMDB on every request. With no genre signal (empty watchlist,
 * one added before genres were tracked, or no logged-in user at all), falls
 * back to titles that are both highly rated and actually popular. */
export async function getRecommendations(userId: string | null): Promise<Recommendations> {
  const genreId = userId === null ? null : await genreFromWatchlist(userId);

  if (genreId === null) {
    const { results } = await getTopRatedPopular();
    return { genreId: null, basis: 'popular', movies: results };
  }

  const { results } = await getMoviesByGenre(String(genreId));
  return { genreId, basis: 'genre', movies: results };
}

async function genreFromWatchlist(userId: string): Promise<number | null> {
  const items = await prisma.watchlistItem.findMany({ where: { userId }, select: { genreIds: true } });
  return mostFrequentGenre(items.map((item) => item.genreIds));
}
