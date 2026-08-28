import { MovieCard } from "@/components/MovieCard";
import { SearchBar } from "@/components/SearchBar";
import { searchMovies } from "@/lib/tmdb";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const results = q ? await searchMovies(q, Number(page)) : null;

  return (
    <div>
      <SearchBar initialQuery={q} />

      {results && (
        <>
          <p className="my-6 text-sm text-white/60">
            {results.total_results} result{results.total_results === 1 ? "" : "s"} for “{q}”
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {results.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
