import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Carousel } from "@/components/Carousel";
import { TVCard } from "@/components/TVCard";
import { backdropUrl, getTVShowDetails, posterUrl } from "@/lib/tmdb";
import type { Video } from "@/types/tmdb";

export const revalidate = 21600; // 6 hours

function findTrailer(videos: Video[]) {
  return videos.find((video) => video.site === "YouTube" && video.type === "Trailer");
}

export default async function TVShowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const show = await getTVShowDetails(id).catch(() => null);
  if (!show) {
    notFound();
  }

  const backdrop = backdropUrl(show.backdrop_path);
  const poster = posterUrl(show.poster_path, "w500");
  const trailer = findTrailer(show.videos.results);
  const year = show.first_air_date ? show.first_air_date.slice(0, 4) : "—";

  return (
    <div>
      {backdrop && (
        <div className="relative -mx-6 mb-8 aspect-[16/6] overflow-hidden">
          <Image src={backdrop} alt="" fill className="object-cover opacity-40" priority />
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-white/5">
          {poster && <Image src={poster} alt={show.name} fill className="object-cover" />}
        </div>

        <div>
          <h1 className="text-3xl font-semibold">{show.name}</h1>
          {show.tagline && <p className="mt-1 italic text-white/50">{show.tagline}</p>}

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
            <span>{year}</span>
            <span>
              {show.number_of_seasons} season{show.number_of_seasons === 1 ? "" : "s"}
            </span>
            <span className="text-[var(--accent)]">★ {show.vote_average.toFixed(1)}</span>
            <span>{show.genres.map((genre) => genre.name).join(", ")}</span>
          </div>

          <p className="mt-6 max-w-2xl leading-relaxed text-white/80">{show.overview}</p>

          {show.credits.cast.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">Cast</h2>
              <div className="flex flex-wrap gap-4">
                {show.credits.cast.slice(0, 8).map((member) => (
                  <Link key={member.id} href={`/person/${member.id}`} className="w-24 text-center text-xs">
                    <p className="font-medium text-white hover:underline">{member.name}</p>
                    <p className="text-white/50">{member.character}</p>
                  </Link>
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

      <Carousel
        title="Similar Shows"
        items={show.similar.results}
        renderItem={(similar) => <TVCard key={similar.id} show={similar} />}
      />
    </div>
  );
}
