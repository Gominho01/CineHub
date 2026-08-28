import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

import { SearchBar } from "../SearchBar";

describe("SearchBar", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("navigates to the search results page on submit", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    await user.type(screen.getByRole("searchbox"), "dune");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(push).toHaveBeenCalledWith("/search?q=dune");
  });

  it("does not navigate for an empty query", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(push).not.toHaveBeenCalled();
  });

  it("pre-fills the input with an initial query", () => {
    render(<SearchBar initialQuery="matrix" />);

    expect(screen.getByRole("searchbox")).toHaveValue("matrix");
  });
});
