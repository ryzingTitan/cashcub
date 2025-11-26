import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { useUser } from "@auth0/nextjs-auth0/client";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));
vi.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: vi.fn(),
}));

describe("Header", () => {
  it("renders skeletons when loading", () => {
    vi.mocked(useUser).mockReturnValue({
      user: undefined,
      isLoading: true,
      error: undefined,
      invalidate: vi.fn(),
    });

    render(<Header />);

    expect(screen.getAllByTestId("loading-skeleton")).toHaveLength(3);
  });

  it("renders user information when authenticated", () => {
    vi.mocked(useUser).mockReturnValue({
      user: {
        name: "Test User",
        picture: "https://example.com/avatar.png",
        sub: "test",
      },
      isLoading: false,
      error: null,
      invalidate: vi.fn(),
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
      invalidate: vi.fn(),
    });

    render(<Header />);

    expect(screen.queryByText("Welcome,")).not.toBeInTheDocument();
  });

  it("redirects to the error page when there is an error", () => {
    vi.mocked(useUser).mockReturnValue({
      user: null,
      isLoading: false,
      error: new Error("Test error"),
      invalidate: vi.fn(),
    });

    render(<Header />);

    expect(mockPush).toHaveBeenCalledWith("/error");
  });
});
