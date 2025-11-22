"use client";

import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
  }),
}));
import { BottomNavigationActionProps } from "@mui/material";

vi.mock("@mui/material/BottomNavigationAction", () => ({
  default: (props: BottomNavigationActionProps) => (
    <button {...props}>{props.label}</button>
  ),
}));
vi.mock("@mui/icons-material", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    AttachMoney: () => <div />,
    Analytics: () => <div />,
  };
});
vi.mock("usehooks-ts", () => ({
  useToggle: () => [false, vi.fn()],
}));
vi.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: () => ({
    user: {
      name: "Test User",
    },
  }),
}));

describe("Footer", () => {
  it("should render the footer", () => {
    render(<Footer />);
    expect(screen.getByText("Budgets")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });
});
