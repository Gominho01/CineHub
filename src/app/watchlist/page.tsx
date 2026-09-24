'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { listWatchlist, rateWatchlistItem, removeFromWatchlist } from '@/lib/api-client';
import { posterUrl } from '@/lib/tmdb';
import { useAuthStore } from '@/store/auth';

export default function WatchlistPage() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  const watchlistQuery = useQuery({
    queryKey: ['watchlist'],
    queryFn: () => listWatchlist(token!),
    enabled: !!token,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['watchlist'] });
  }

  const removeMutation = useMutation({
    mutationFn: (movieId: number) => removeFromWatchlist(token!, movieId),
    onSuccess: invalidate,
  });

  const rateMutation = useMutation({
    mutationFn: ({ movieId, rating }: { movieId: number; rating: number }) =>
      rateWatchlistItem(token!, movieId, rating),
    onSuccess: invalidate,
  });

  if (!token) {
    return (
      <p>
        <Link href="/login" className="underline">
          Log in
        </Link>{' '}
        to see your watchlist.
      </p>
    );
  }

  const items = watchlistQuery.data ?? [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">My Watchlist</h1>

      {watchlistQuery.isLoading && <p className="text-white/60">Loading…</p>}
      {!watchlistQuery.isLoading && items.length === 0 && (
        <p className="text-white/60">Nothing here yet — add a title from its detail page.</p>
      )}

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => {
          const poster = posterUrl(item.posterPath);
          return (
            <div key={item.id} className="flex flex-col gap-2">
              <Link href={`/movie/${item.movieId}`} className="block">
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-white/5">
                  {poster && <Image src={poster} alt={item.title} fill sizes="200px" className="object-cover" />}
                </div>
                <p className="mt-2 line-clamp-1 text-sm font-medium">{item.title}</p>
              </Link>

              <div className="flex items-center gap-1" role="radiogroup" aria-label={`Rating for ${item.title}`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={item.rating === star}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    onClick={() => rateMutation.mutate({ movieId: item.movieId, rating: star })}
                    className={star <= (item.rating ?? 0) ? 'text-[var(--accent)]' : 'text-white/50'}
                  >
                    ★
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => removeMutation.mutate(item.movieId)}
                className="w-fit text-xs text-white/50 underline"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
