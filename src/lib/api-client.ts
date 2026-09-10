import type { Movie } from '@/types/tmdb';

export interface WatchlistItem {
  id: string;
  movieId: number;
  title: string;
  posterPath: string | null;
  rating: number | null;
  addedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

async function request<T>(path: string, token?: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message ?? `Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export function registerRequest(email: string, password: string, name: string): Promise<AuthResult> {
  return request<AuthResult>('/auth/register', undefined, {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

export function loginRequest(email: string, password: string): Promise<AuthResult> {
  return request<AuthResult>('/auth/login', undefined, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function listWatchlist(token: string): Promise<WatchlistItem[]> {
  return request<WatchlistItem[]>('/watchlist', token);
}

export function addToWatchlist(
  token: string,
  data: { movieId: number; title: string; posterPath: string | null; genreIds?: number[] },
): Promise<WatchlistItem> {
  return request<WatchlistItem>('/watchlist', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function removeFromWatchlist(token: string, movieId: number): Promise<void> {
  return request<void>(`/watchlist/${movieId}`, token, { method: 'DELETE' });
}

export function rateWatchlistItem(token: string, movieId: number, rating: number | null): Promise<WatchlistItem> {
  return request<WatchlistItem>(`/watchlist/${movieId}`, token, {
    method: 'PATCH',
    body: JSON.stringify({ rating }),
  });
}

export interface Recommendations {
  genreId: number | null;
  basis: 'genre' | 'popular';
  movies: Movie[];
}

export function getRecommendations(token?: string): Promise<Recommendations> {
  return request<Recommendations>('/recommendations', token);
}
