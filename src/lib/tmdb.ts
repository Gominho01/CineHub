import type { Genre, Movie, MovieDetails, PaginatedResponse } from "@/types/tmdb";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

const API_BASE_URL = required("TMDB_API_BASE_URL", "https://api.themoviedb.org/3");
const IMAGE_BASE_URL = required("TMDB_IMAGE_BASE_URL", "https://image.tmdb.org/t/p");

function apiKey(): string {
  return required("TMDB_API_KEY");
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);
  url.searchParams.set("api_key", apiKey());
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, { next: { revalidate: 60 * 60 * 6 } });
  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status}): ${path}`);
  }

  return response.json() as Promise<T>;
}

export function posterUrl(path: string | null, size: "w342" | "w500" | "original" = "w342"): string | null {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function backdropUrl(path: string | null, size: "w780" | "w1280" | "original" = "w1280"): string | null {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getNowPlaying(page = 1): Promise<PaginatedResponse<Movie>> {
  return tmdbFetch("/movie/now_playing", { page: String(page) });
}

export function getTrending(page = 1): Promise<PaginatedResponse<Movie>> {
  return tmdbFetch("/trending/movie/week", { page: String(page) });
}

export function getTopRated(page = 1): Promise<PaginatedResponse<Movie>> {
  return tmdbFetch("/movie/top_rated", { page: String(page) });
}

export function searchMovies(query: string, page = 1): Promise<PaginatedResponse<Movie>> {
  return tmdbFetch("/search/movie", { query, page: String(page) });
}

export function getMovieDetails(id: string): Promise<MovieDetails> {
  return tmdbFetch(`/movie/${id}`, { append_to_response: "credits,videos" });
}

export function getGenres(): Promise<{ genres: Genre[] }> {
  return tmdbFetch("/genre/movie/list");
}

export function getMoviesByGenre(genreId: string, page = 1): Promise<PaginatedResponse<Movie>> {
  return tmdbFetch("/discover/movie", { with_genres: genreId, page: String(page) });
}
