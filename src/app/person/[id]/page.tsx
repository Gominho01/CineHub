import Image from "next/image";
import { notFound } from "next/navigation";
import { Carousel } from "@/components/Carousel";
import { MovieCard } from "@/components/MovieCard";
import { getPersonDetails, posterUrl } from "@/lib/tmdb";

export const revalidate = 21600; // 6 hours

export default async function PersonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const person = await getPersonDetails(id).catch(() => null);
  if (!person) {
    notFound();
  }

  const photo = posterUrl(person.profile_path, "w500");
  const knownFor = [...person.movie_credits.cast].sort((a, b) => b.vote_average - a.vote_average).slice(0, 12);

  return (
    <div>
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-white/5">
          {photo && <Image src={photo} alt={person.name} fill className="object-cover" />}
        </div>

        <div>
          <h1 className="text-3xl font-semibold">{person.name}</h1>
          {person.known_for_department && (
            <p className="mt-1 text-sm text-white/60">{person.known_for_department}</p>
          )}
          {person.birthday && <p className="mt-1 text-sm text-white/60">Born {person.birthday}</p>}
          {person.biography && <p className="mt-6 max-w-2xl leading-relaxed text-white/80">{person.biography}</p>}
        </div>
      </div>

      <div className="mt-8">
        <Carousel
          title="Known For"
          items={knownFor}
          renderItem={(movie) => <MovieCard key={movie.id} movie={movie} />}
        />
      </div>
    </div>
  );
}
