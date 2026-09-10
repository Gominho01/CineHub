import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TVCard } from "../TVCard";
import type { TVShow } from "@/types/tmdb";

const show: TVShow = {
  id: 42,
  name: "Test Show",
  overview: "An overview.",
  poster_path: "/poster.jpg",
  backdrop_path: null,
  first_air_date: "2026-03-15",
  vote_average: 7.8,
  genre_ids: [18],
};

describe("TVCard", () => {
  it("renders the name, year and rating", () => {
    render(<TVCard show={show} />);

    expect(screen.getByText("Test Show")).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getByText("7.8")).toBeInTheDocument();
  });

  it("links to the TV show detail page", () => {
    render(<TVCard show={show} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/tv/42");
  });

  it("falls back to a placeholder when there is no poster", () => {
    render(<TVCard show={{ ...show, poster_path: null }} />);

    expect(screen.getByText("No image")).toBeInTheDocument();
  });
});
