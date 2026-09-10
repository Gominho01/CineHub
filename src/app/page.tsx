import { Carousel } from "@/components/Carousel";
import { MovieCard } from "@/components/MovieCard";
import { TVCard } from "@/components/TVCard";
import { getNowPlaying, getTopRated, getTrending, getTrendingTV } from "@/lib/tmdb";
import type { Movie, PaginatedResponse, TVShow } from "@/types/tmdb";

export const revalidate = 21600; // 6 hours

async function safeResults<T>(promise: Promise<PaginatedResponse<T>>): Promise<T[]> {
  try {
    const data = await promise;
    return data.results;
  } catch {
    // TMDB may be unreachable (missing key, rate limit, outage) — degrade
    // that one row instead of taking down the whole page.
    return [];
  }
}

export default async function HomePage() {
  const [nowPlaying, trending, topRated, trendingTV] = await Promise.all([
    safeResults<Movie>(getNowPlaying()),
    safeResults<Movie>(getTrending()),
    safeResults<Movie>(getTopRated()),
    safeResults<TVShow>(getTrendingTV()),
  ]);

  const hasAnything = nowPlaying.length > 0 || trending.length > 0 || topRated.length > 0 || trendingTV.length > 0;

  return (
    <div>
      <Carousel title="In Theaters" items={nowPlaying} renderItem={(movie) => <MovieCard key={movie.id} movie={movie} />} />
      <Carousel
        title="Trending This Week"
        items={trending}
        renderItem={(movie) => <MovieCard key={movie.id} movie={movie} />}
      />
      <Carousel title="Top Rated" items={topRated} renderItem={(movie) => <MovieCard key={movie.id} movie={movie} />} />
      <Carousel
        title="Trending TV Shows"
        items={trendingTV}
        renderItem={(show) => <TVCard key={show.id} show={show} />}
      />
      {!hasAnything && <p className="text-white/60">Nothing to show right now.</p>}
    </div>
  );
}
