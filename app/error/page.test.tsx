"use client";

import { render, screen } from "@testing-library/react";
import ErrorPage from "./page";
import { describe, it, expect, vi, beforeEach, MockedFunction } from "vitest";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("ErrorPage", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should render the error page with a friendly message and a HOME button", () => {
    render(<ErrorPage />);
    expect(screen.getByText("Oops! Something went wrong.")).toBeInTheDocument();
    expect(
      screen.getByText("We're sorry, but an unexpected error has occurred."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "HOME" })).toBeInTheDocument();
  });

  it("should redirect to the home page when the HOME button is clicked", async () => {
    const push = vi.fn();
    (useRouter as MockedFunction<typeof useRouter>).mockReturnValue({
      back(): void {},
      forward(): void {},
      prefetch(): void {},
      refresh(): void {},
      replace(): void {},
      push,
    });
    render(<ErrorPage />);
    await userEvent.click(screen.getByRole("button", { name: "HOME" }));
    expect(push).toHaveBeenCalledWith("/");
  });
});
