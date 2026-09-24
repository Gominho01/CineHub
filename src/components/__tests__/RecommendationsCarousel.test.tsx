import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getRecommendations = vi.fn();
vi.mock('../../lib/api-client', () => ({
  getRecommendations: (...args: unknown[]) => getRecommendations(...args),
}));

const { authState } = vi.hoisted(() => ({ authState: { token: null as string | null } }));
vi.mock('../../store/auth', () => ({
  useAuthStore: (selector: (state: typeof authState) => unknown) => selector(authState),
}));

import { RecommendationsCarousel } from '../RecommendationsCarousel';

function renderWithClient() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <RecommendationsCarousel />
    </QueryClientProvider>,
  );
}

describe('RecommendationsCarousel', () => {
  beforeEach(() => {
    getRecommendations.mockReset();
    authState.token = 'test-token';
  });

  it('still shows recommendations for a logged-out visitor', async () => {
    authState.token = null;
    getRecommendations.mockResolvedValue({
      genreId: null,
      basis: 'popular',
      movies: [
        {
          id: 3,
          title: 'The Godfather',
          overview: '',
          poster_path: null,
          backdrop_path: null,
          release_date: '1972-01-01',
          vote_average: 9,
          genre_ids: [18],
        },
      ],
    });

    renderWithClient();

    await waitFor(() => expect(screen.getByText('The Godfather')).toBeInTheDocument());
    expect(getRecommendations).toHaveBeenCalledWith(undefined);
  });

  it('renders nothing when there are no recommendations yet', async () => {
    getRecommendations.mockResolvedValue({ genreId: null, basis: 'popular', movies: [] });

    const { container } = renderWithClient();

    await waitFor(() => {
      expect(getRecommendations).toHaveBeenCalledWith('test-token');
      expect(container).toBeEmptyDOMElement();
    });
  });

  it('shows the recommended movies once loaded', async () => {
    getRecommendations.mockResolvedValue({
      genreId: 878,
      basis: 'genre',
      movies: [
        {
          id: 1,
          title: 'Dune',
          overview: '',
          poster_path: null,
          backdrop_path: null,
          release_date: '2026-01-01',
          vote_average: 8,
          genre_ids: [878],
        },
      ],
    });

    renderWithClient();

    await waitFor(() => expect(screen.getByText('Dune')).toBeInTheDocument());
    expect(screen.getByRole('heading', { name: /recommended for you/i })).toBeInTheDocument();
  });

  it('shows a "Popular & Top Rated" heading for the no-genre-signal fallback', async () => {
    getRecommendations.mockResolvedValue({
      genreId: null,
      basis: 'popular',
      movies: [
        {
          id: 2,
          title: 'The Shawshank Redemption',
          overview: '',
          poster_path: null,
          backdrop_path: null,
          release_date: '1994-01-01',
          vote_average: 9,
          genre_ids: [18],
        },
      ],
    });

    renderWithClient();

    await waitFor(() => expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument());
    expect(screen.getByRole('heading', { name: /popular & top rated/i })).toBeInTheDocument();
  });
});
