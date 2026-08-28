import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MovieCard } from "../MovieCard";
import type { Movie } from "@/types/tmdb";

const movie: Movie = {
  id: 42,
  title: "Test Movie",
  overview: "An overview.",
  poster_path: "/poster.jpg",
  backdrop_path: null,
  release_date: "2026-03-15",
  vote_average: 7.8,
  genre_ids: [28],
};

describe("MovieCard", () => {
  it("renders the title, year and rating", () => {
    render(<MovieCard movie={movie} />);

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getByText("7.8")).toBeInTheDocument();
  });

  it("links to the movie detail page", () => {
    render(<MovieCard movie={movie} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/movie/42");
  });

  it("falls back to a placeholder when there is no poster", () => {
    render(<MovieCard movie={{ ...movie, poster_path: null }} />);

    expect(screen.getByText("No image")).toBeInTheDocument();
  });
});
