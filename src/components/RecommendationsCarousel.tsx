'use client';

import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '../lib/api-client';
import { useAuthStore } from '../store/auth';
import { Carousel } from './Carousel';
import { MovieCard } from './MovieCard';

export function RecommendationsCarousel() {
  const token = useAuthStore((s) => s.token);

  const query = useQuery({
    queryKey: ['recommendations', token ?? 'anon'],
    queryFn: () => getRecommendations(token ?? undefined),
  });

  if (query.isLoading) {
    return (
      <section className="mb-10">
        <div className="mb-3 h-[1.125rem] w-40 animate-pulse rounded bg-white/10" />
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-40 shrink-0 sm:w-48">
              <div className="aspect-[2/3] animate-pulse rounded-lg bg-white/5" />
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="mt-1 h-3 w-1/3 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!query.data || query.data.movies.length === 0) {
    return null;
  }

  const title = query.data.basis === 'popular' ? 'Popular & Top Rated' : 'Recommended for you';

  return (
    <Carousel
      title={title}
      items={query.data.movies}
      renderItem={(movie) => <MovieCard key={movie.id} movie={movie} />}
    />
  );
}
