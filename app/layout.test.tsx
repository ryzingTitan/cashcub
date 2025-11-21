"use client";

import { render, screen } from "@testing-library/react";
import RootLayout from "./layout";
import { vi, describe, it, expect } from "vitest";

vi.mock("@/components/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="header" />,
}));
vi.mock("@/components/Footer", () => ({
  __esModule: true,
  default: () => <div data-testid="footer" />,
}));
vi.mock("next/font/google", () => ({
  Roboto: () => ({
    style: {
      fontFamily: "mocked",
    },
  }),
}));

describe("RootLayout", () => {
  it("should render the layout with all components and children", () => {
    render(
      <RootLayout>
        <div>Child Component</div>
      </RootLayout>,
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });
});
