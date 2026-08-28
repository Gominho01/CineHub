import Image from "next/image";
import { notFound } from "next/navigation";
import { backdropUrl, getMovieDetails, posterUrl } from "@/lib/tmdb";
import type { Video } from "@/types/tmdb";

export const revalidate = 21600; // 6 hours

function findTrailer(videos: Video[]) {
  return videos.find((video) => video.site === "YouTube" && video.type === "Trailer");
}

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const movie = await getMovieDetails(id).catch(() => null);
  if (!movie) {
    notFound();
  }

  const backdrop = backdropUrl(movie.backdrop_path);
  const poster = posterUrl(movie.poster_path, "w500");
  const trailer = findTrailer(movie.videos.results);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";

  return (
    <div>
      {backdrop && (
        <div className="relative -mx-6 mb-8 aspect-[16/6] overflow-hidden">
          <Image src={backdrop} alt="" fill className="object-cover opacity-40" priority />
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-white/5">
          {poster && <Image src={poster} alt={movie.title} fill className="object-cover" />}
        </div>

        <div>
          <h1 className="text-3xl font-semibold">{movie.title}</h1>
          {movie.tagline && <p className="mt-1 italic text-white/50">{movie.tagline}</p>}

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
            <span>{year}</span>
            {movie.runtime && <span>{movie.runtime} min</span>}
            <span className="text-[var(--accent)]">★ {movie.vote_average.toFixed(1)}</span>
            <span>{movie.genres.map((genre) => genre.name).join(", ")}</span>
          </div>

          <p className="mt-6 max-w-2xl leading-relaxed text-white/80">{movie.overview}</p>

          {movie.credits.cast.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">Cast</h2>
              <div className="flex flex-wrap gap-4">
                {movie.credits.cast.slice(0, 8).map((member) => (
                  <div key={member.id} className="w-24 text-center text-xs text-white/70">
                    <p className="font-medium text-white">{member.name}</p>
                    <p className="text-white/50">{member.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {trailer && (
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">Trailer</h2>
              <div className="aspect-video max-w-2xl overflow-hidden rounded-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={trailer.name}
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
