import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { useUser } from "@auth0/nextjs-auth0/client";

vi.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: vi.fn(),
}));

describe("Header", () => {
  it("renders skeletons when loading", () => {
    vi.mocked(useUser).mockReturnValue({
      user: undefined,
      isLoading: true,
      error: undefined,
    });

    render(<Header />);

    expect(screen.getAllByTestId("loading-skeleton")).toHaveLength(3);
  });

  it("renders user information when authenticated", () => {
    vi.mocked(useUser).mockReturnValue({
      user: {
        name: "Test User",
        picture: "https://example.com/avatar.png",
      },
      isLoading: false,
      error: undefined,
    });

    render(<Header />);

    expect(screen.getByAltText("Test User")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Logout" })).toBeInTheDocument();
  });

  it("renders nothing when not authenticated", () => {
    vi.mocked(useUser).mockReturnValue({
      user: undefined,
      isLoading: false,
      error: undefined,
    });

    render(<Header />);

    expect(screen.queryByText("Welcome,")).not.toBeInTheDocument();
  });

  it("renders an error message when there is an error", () => {
    vi.mocked(useUser).mockReturnValue({
      user: undefined,
      isLoading: false,
      error: new Error("Test error"),
    });

    render(<Header />);

    expect(
      screen.getByText("Something went wrong. Please try again later."),
    ).toBeInTheDocument();
  });
});
