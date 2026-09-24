import Image from "next/image";
import Link from "next/link";
import { posterUrl } from "@/lib/tmdb";
import type { TVShow } from "@/types/tmdb";

export function TVCard({ show }: { show: TVShow }) {
  const poster = posterUrl(show.poster_path);
  const year = show.first_air_date ? show.first_air_date.slice(0, 4) : "—";

  return (
    <Link href={`/tv/${show.id}`} className="group block w-40 shrink-0 sm:w-48">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-white/5">
        {poster ? (
          <Image
            src={poster}
            alt={show.name}
            fill
            sizes="(max-width: 640px) 160px, 192px"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-white/50">No image</div>
        )}
        <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white/90">
          {show.vote_average.toFixed(1)}
        </div>
      </div>
      <p className="mt-2 line-clamp-1 text-sm font-medium">{show.name}</p>
      <p className="text-xs text-white/50">{year}</p>
    </Link>
  );
}
