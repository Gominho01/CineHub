"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Genre } from "@/types/tmdb";

const MIN_YEAR = 1950;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - MIN_YEAR + 1 }, (_, i) => CURRENT_YEAR - i);
const MIN_RATINGS = [5, 6, 7, 8, 9];

export function SearchFilters({ genres }: { genres: Genre[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="my-4 flex flex-wrap gap-3" role="group" aria-label="Search filters">
      <select
        aria-label="Genre"
        value={searchParams.get("genre") ?? ""}
        onChange={(event) => updateParam("genre", event.target.value)}
        className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
      >
        <option value="">Any genre</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      <select
        aria-label="Year"
        value={searchParams.get("year") ?? ""}
        onChange={(event) => updateParam("year", event.target.value)}
        className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
      >
        <option value="">Any year</option>
        {YEARS.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select
        aria-label="Minimum rating"
        value={searchParams.get("minRating") ?? ""}
        onChange={(event) => updateParam("minRating", event.target.value)}
        className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
      >
        <option value="">Any rating</option>
        {MIN_RATINGS.map((rating) => (
          <option key={rating} value={rating}>
            {rating}+ ★
          </option>
        ))}
      </select>
    </div>
  );
}
