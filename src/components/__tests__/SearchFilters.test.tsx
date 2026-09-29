import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
let currentSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => currentSearchParams,
}));

import { SearchFilters } from "../SearchFilters";

const genres = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
];

describe("SearchFilters", () => {
  beforeEach(() => {
    push.mockClear();
    currentSearchParams = new URLSearchParams("q=dune");
  });

  it("sets the genre filter and resets the page", () => {
    render(<SearchFilters genres={genres} />);

    fireEvent.change(screen.getByRole("combobox", { name: "Genre" }), { target: { value: "28" } });

    expect(push).toHaveBeenCalledWith("/search?q=dune&genre=28");
  });

  it("clears a filter when set back to the default option", () => {
    currentSearchParams = new URLSearchParams("q=dune&year=1999");
    render(<SearchFilters genres={genres} />);

    fireEvent.change(screen.getByRole("combobox", { name: "Year" }), { target: { value: "" } });

    expect(push).toHaveBeenCalledWith("/search?q=dune");
  });

  it("reflects the current minimum rating filter", () => {
    currentSearchParams = new URLSearchParams("q=dune&minRating=7");
    render(<SearchFilters genres={genres} />);

    expect(screen.getByRole("combobox", { name: "Minimum rating" })).toHaveValue("7");
  });
});
