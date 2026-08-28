import { MovieCard } from "@/components/MovieCard";
import { getGenres, getMoviesByGenre } from "@/lib/tmdb";

export const revalidate = 21600; // 6 hours

export async function generateStaticParams() {
  // If TMDB isn't reachable at build time, fall back to rendering genre
  // pages on demand instead of failing the whole build.
  try {
    const { genres } = await getGenres();
    return genres.map((genre) => ({ genre: genre.name.toLowerCase() }));
  } catch {
    return [];
  }
}

export default async function GenrePage({ params }: { params: Promise<{ genre: string }> }) {
  const { genre } = await params;

  const { genres } = await getGenres();
  const match = genres.find((g) => g.name.toLowerCase() === genre.toLowerCase());

  const movies = match ? await getMoviesByGenre(String(match.id)) : null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold capitalize">{genre}</h1>

      {!movies || movies.results.length === 0 ? (
        <p className="text-white/60">No movies found for this genre.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
