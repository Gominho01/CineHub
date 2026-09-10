import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { WatchlistItem } from '../../lib/api-client';

const listWatchlist = vi.fn();
const addToWatchlist = vi.fn();
const removeFromWatchlist = vi.fn();
const rateWatchlistItem = vi.fn();

vi.mock('../../lib/api-client', () => ({
  listWatchlist: (...args: unknown[]) => listWatchlist(...args),
  addToWatchlist: (...args: unknown[]) => addToWatchlist(...args),
  removeFromWatchlist: (...args: unknown[]) => removeFromWatchlist(...args),
  rateWatchlistItem: (...args: unknown[]) => rateWatchlistItem(...args),
}));

const { authState } = vi.hoisted(() => ({ authState: { token: null as string | null } }));
vi.mock('../../store/auth', () => ({
  useAuthStore: (selector: (state: typeof authState) => unknown) => selector(authState),
}));

import { WatchlistButton } from '../WatchlistButton';

function renderWithClient() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <WatchlistButton movieId={42} title="Dune" posterPath="/dune.jpg" genreIds={[878]} />
    </QueryClientProvider>,
  );
}

describe('WatchlistButton', () => {
  beforeEach(() => {
    listWatchlist.mockReset();
    addToWatchlist.mockReset();
    removeFromWatchlist.mockReset();
    rateWatchlistItem.mockReset();
    authState.token = 'test-token';
  });

  it('prompts a logged-out visitor to log in', () => {
    authState.token = null;

    renderWithClient();

    expect(screen.getByRole('link', { name: /log in/i })).toHaveAttribute('href', '/login');
  });

  it('offers to add the movie when it is not on the watchlist yet', async () => {
    listWatchlist.mockResolvedValue([]);

    renderWithClient();

    await waitFor(() => expect(screen.getByRole('button', { name: /add to watchlist/i })).toBeInTheDocument());
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
  });

  it('adds the movie to the watchlist', async () => {
    listWatchlist.mockResolvedValue([]);
    addToWatchlist.mockResolvedValue({});

    renderWithClient();

    await waitFor(() => screen.getByRole('button', { name: /add to watchlist/i }));
    fireEvent.click(screen.getByRole('button', { name: /add to watchlist/i }));

    await waitFor(() =>
      expect(addToWatchlist).toHaveBeenCalledWith('test-token', {
        movieId: 42,
        title: 'Dune',
        posterPath: '/dune.jpg',
        genreIds: [878],
      }),
    );
  });

  it('shows the rating control and removes the movie when already on the watchlist', async () => {
    const item: WatchlistItem = {
      id: 'w1',
      movieId: 42,
      title: 'Dune',
      posterPath: '/dune.jpg',
      rating: 3,
      addedAt: '2026-01-01T00:00:00.000Z',
    };
    listWatchlist.mockResolvedValue([item]);
    removeFromWatchlist.mockResolvedValue(undefined);

    renderWithClient();

    await waitFor(() => expect(screen.getByRole('button', { name: /remove from watchlist/i })).toBeInTheDocument());
    expect(screen.getByRole('radio', { name: '3 stars', checked: true })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /remove from watchlist/i }));
    await waitFor(() => expect(removeFromWatchlist).toHaveBeenCalledWith('test-token', 42));
  });
});
