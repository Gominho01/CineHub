import { describe, expect, it } from "vitest";
import { backdropUrl, posterUrl } from "../tmdb";

describe("posterUrl", () => {
  it("builds a full poster URL for a given path", () => {
    expect(posterUrl("/abc123.jpg")).toBe("https://image.tmdb.org/t/p/w342/abc123.jpg");
  });

  it("respects a custom size", () => {
    expect(posterUrl("/abc123.jpg", "original")).toBe("https://image.tmdb.org/t/p/original/abc123.jpg");
  });

  it("returns null when there is no path", () => {
    expect(posterUrl(null)).toBeNull();
  });
});

describe("backdropUrl", () => {
  it("builds a full backdrop URL for a given path", () => {
    expect(backdropUrl("/xyz789.jpg")).toBe("https://image.tmdb.org/t/p/w1280/xyz789.jpg");
  });

  it("returns null when there is no path", () => {
    expect(backdropUrl(null)).toBeNull();
  });
});
