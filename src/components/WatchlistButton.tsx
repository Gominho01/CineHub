'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { addToWatchlist, listWatchlist, rateWatchlistItem, removeFromWatchlist } from '../lib/api-client';
import { useAuthStore } from '../store/auth';

interface WatchlistButtonProps {
  movieId: number;
  title: string;
  posterPath: string | null;
  genreIds: number[];
}

export function WatchlistButton({ movieId, title, posterPath, genreIds }: WatchlistButtonProps) {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  const watchlistQuery = useQuery({
    queryKey: ['watchlist'],
    queryFn: () => listWatchlist(token!),
    enabled: !!token,
  });

  const item = watchlistQuery.data?.find((i) => i.movieId === movieId);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['watchlist'] });
  }

  const addMutation = useMutation({
    mutationFn: () => addToWatchlist(token!, { movieId, title, posterPath, genreIds }),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: () => removeFromWatchlist(token!, movieId),
    onSuccess: invalidate,
  });

  const rateMutation = useMutation({
    mutationFn: (rating: number) => rateWatchlistItem(token!, movieId, rating),
    onSuccess: invalidate,
  });

  if (!token) {
    return (
      <Link href="/login" className="text-sm text-white/60 underline">
        Log in to add to your watchlist
      </Link>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => (item ? removeMutation.mutate() : addMutation.mutate())}
        className="w-fit rounded-md border border-white/10 px-4 py-2 text-sm"
      >
        {item ? '− Remove from watchlist' : '+ Add to watchlist'}
      </button>

      {item && (
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={item.rating === star}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
              onClick={() => rateMutation.mutate(star)}
              className={star <= (item.rating ?? 0) ? 'text-[var(--accent)]' : 'text-white/50'}
            >
              ★
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
