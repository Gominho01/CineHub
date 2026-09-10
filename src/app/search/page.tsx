import { MovieCard } from "@/components/MovieCard";
import { SearchBar } from "@/components/SearchBar";
import { TVCard } from "@/components/TVCard";
import { searchMovies, searchTV } from "@/lib/tmdb";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const [movieResults, tvResults] = q
    ? await Promise.all([searchMovies(q, Number(page)), searchTV(q, Number(page))])
    : [null, null];

  return (
    <div>
      <SearchBar initialQuery={q} />

      {movieResults && (
        <>
          <p className="my-6 text-sm text-white/60">
            {movieResults.total_results} movie result{movieResults.total_results === 1 ? "" : "s"} for “{q}”
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movieResults.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}

      {tvResults && tvResults.results.length > 0 && (
        <>
          <p className="my-6 text-sm text-white/60">
            {tvResults.total_results} TV result{tvResults.total_results === 1 ? "" : "s"} for “{q}”
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {tvResults.results.map((show) => (
              <TVCard key={show.id} show={show} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
