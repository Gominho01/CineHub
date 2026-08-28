import Image from "next/image";
import Link from "next/link";
import { posterUrl } from "@/lib/tmdb";
import type { Movie } from "@/types/tmdb";

export function MovieCard({ movie }: { movie: Movie }) {
  const poster = posterUrl(movie.poster_path);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group block w-40 shrink-0 sm:w-48"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-white/5">
        {poster ? (
          <Image
            src={poster}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 160px, 192px"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-white/40">
            No image
          </div>
        )}
        <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-[var(--accent)]">
          {movie.vote_average.toFixed(1)}
        </div>
      </div>
      <p className="mt-2 line-clamp-1 text-sm font-medium">{movie.title}</p>
      <p className="text-xs text-white/50">{year}</p>
    </Link>
  );
}
