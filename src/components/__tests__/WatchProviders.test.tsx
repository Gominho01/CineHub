import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WatchProviders } from "../WatchProviders";
import type { WatchProvidersResponse } from "@/types/tmdb";

describe("WatchProviders", () => {
  it("renders flatrate providers for the US region", () => {
    const providers: WatchProvidersResponse = {
      results: {
        US: {
          link: "https://www.themoviedb.org/movie/1-example/watch",
          flatrate: [{ provider_id: 8, provider_name: "Netflix", logo_path: "/netflix.jpg" }],
        },
      },
    };

    render(<WatchProviders providers={providers} />);

    expect(screen.getByRole("heading", { name: "Where to Watch" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Netflix" })).toHaveAttribute(
      "href",
      "https://www.themoviedb.org/movie/1-example/watch",
    );
  });

  it("falls back to rent providers when there is no flatrate option", () => {
    const providers: WatchProvidersResponse = {
      results: {
        US: {
          link: "https://www.themoviedb.org/movie/1-example/watch",
          rent: [{ provider_id: 2, provider_name: "Apple TV", logo_path: "/apple.jpg" }],
        },
      },
    };

    render(<WatchProviders providers={providers} />);

    expect(screen.getByRole("link", { name: "Apple TV" })).toBeInTheDocument();
  });

  it("renders nothing when there is no US region data", () => {
    const { container } = render(<WatchProviders providers={{ results: {} }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when providers are undefined", () => {
    const { container } = render(<WatchProviders providers={undefined} />);

    expect(container).toBeEmptyDOMElement();
  });
});
