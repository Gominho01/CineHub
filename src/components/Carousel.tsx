import type { Movie } from "@/types/tmdb";
import { MovieCard } from "./MovieCard";

export function Carousel({ title, movies }: { title: string; movies: Movie[] }) {
  if (movies.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
