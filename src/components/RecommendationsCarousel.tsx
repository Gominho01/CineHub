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
