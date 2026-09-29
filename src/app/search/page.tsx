import Link from "next/link";
import { MovieCard } from "@/components/MovieCard";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { TVCard } from "@/components/TVCard";
import { getGenres, getTVGenres, searchMovies, searchTV } from "@/lib/tmdb";
import type { Movie, TVShow } from "@/types/tmdb";

interface Filters {
  year: string | null;
  minRating: number | null;
}

/** `genreId: undefined` means "don't filter by genre at all" for this item —
 * either no genre filter is active, or (for TV) no TV genre with a matching
 * name was found, in which case we show every result rather than hiding all
 * of them over a namespace mismatch. */
function matchesFilters(item: Movie | TVShow, date: string, filters: Filters, genreId: number | null | undefined) {
  if (genreId !== undefined && genreId !== null && !item.genre_ids.includes(genreId)) return false;
  if (filters.year && date.slice(0, 4) !== filters.year) return false;
  if (filters.minRating !== null && item.vote_average < filters.minRating) return false;
  return true;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; genre?: string; year?: string; minRating?: string }>;
}) {
  const { q = "", page = "1", genre, year, minRating } = await searchParams;

  const genreId = genre ? Number(genre) : null;
  const filters: Filters = {
    year: year ?? null,
    minRating: minRating ? Number(minRating) : null,
  };

  const [{ genres: movieGenres }, { genres: tvGenres }, movieResults, tvResults] = q
    ? await Promise.all([getGenres(), getTVGenres(), searchMovies(q, Number(page)), searchTV(q, Number(page))])
    : await Promise.all([getGenres(), getTVGenres(), Promise.resolve(null), Promise.resolve(null)]);

  // Movie and TV genre IDs are separate TMDB namespaces — resolve the TV
  // genre with the same name as the selected movie genre, so filtering TV
  // results doesn't compare against the wrong namespace.
  const selectedGenreName = genreId !== null ? (movieGenres.find((g) => g.id === genreId)?.name ?? null) : null;
  const tvGenreId = selectedGenreName ? (tvGenres.find((g) => g.name === selectedGenreName)?.id ?? undefined) : undefined;

  const filteredMovies = movieResults?.results.filter((movie) =>
    matchesFilters(movie, movie.release_date, filters, genreId ?? undefined),
  );
  const filteredTV = tvResults?.results.filter((show) =>
    matchesFilters(show, show.first_air_date, filters, genreId === null ? undefined : tvGenreId),
  );

  const currentPage = Number(page);
  const totalPages = Math.max(movieResults?.total_pages ?? 0, tvResults?.total_pages ?? 0);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (genre) params.set("genre", genre);
    if (year) params.set("year", year);
    if (minRating) params.set("minRating", minRating);
    params.set("page", String(targetPage));
    return `/search?${params.toString()}`;
  }

  return (
    <div>
      <SearchBar initialQuery={q} />
      <SearchFilters genres={movieGenres} />

      {filteredMovies && (
        <>
          <p className="my-6 text-sm text-white/60">
            {movieResults!.total_results} movie result{movieResults!.total_results === 1 ? "" : "s"} for “{q}”
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}

      {filteredTV && filteredTV.length > 0 && (
        <>
          <p className="my-6 text-sm text-white/60">
            {tvResults!.total_results} TV result{tvResults!.total_results === 1 ? "" : "s"} for “{q}”
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredTV.map((show) => (
              <TVCard key={show.id} show={show} />
            ))}
          </div>
        </>
      )}

      {q && (hasPrev || hasNext) && (
        <div className="mt-8 flex justify-center gap-4">
          {hasPrev && (
            <Link href={pageHref(currentPage - 1)} className="rounded-md border border-white/10 px-4 py-2 text-sm">
              ← Previous
            </Link>
          )}
          {hasNext && (
            <Link href={pageHref(currentPage + 1)} className="rounded-md border border-white/10 px-4 py-2 text-sm">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
