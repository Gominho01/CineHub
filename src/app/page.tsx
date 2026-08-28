import { Carousel } from "@/components/Carousel";
import { getNowPlaying, getTopRated, getTrending } from "@/lib/tmdb";
import type { Movie, PaginatedResponse } from "@/types/tmdb";

export const revalidate = 21600; // 6 hours

async function safeResults(promise: Promise<PaginatedResponse<Movie>>): Promise<Movie[]> {
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
  const [nowPlaying, trending, topRated] = await Promise.all([
    safeResults(getNowPlaying()),
    safeResults(getTrending()),
    safeResults(getTopRated()),
  ]);

  const hasAnyMovies = nowPlaying.length > 0 || trending.length > 0 || topRated.length > 0;

  return (
    <div>
      <Carousel title="In Theaters" movies={nowPlaying} />
      <Carousel title="Trending This Week" movies={trending} />
      <Carousel title="Top Rated" movies={topRated} />
      {!hasAnyMovies && <p className="text-white/60">Nothing to show right now.</p>}
    </div>
  );
}
