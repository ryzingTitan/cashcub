"use client";

import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePathname } from "next/navigation";
import BottomNavigation from "@mui/material/BottomNavigation"; // Import the component to be mocked

const push = vi.fn();

// Mock the next/navigation module
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useRouter: () => ({
    push,
  }),
}));

// Mock the Material-UI component path.
vi.mock("@mui/material/BottomNavigation", () => ({
  default: vi.fn((props) => (
    <div data-testid="bottom-nav">{props.children}</div>
  )),
}));

// Provide a simple mock for the child component
vi.mock("@mui/material/BottomNavigationAction", () => ({
  default: ({ label }: { label: string }) => <div>{label}</div>,
}));

describe("Footer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component and pass the correct value (0) for the budgets route", () => {
    // Arrange
    vi.mocked(usePathname).mockReturnValue("/budgets");

    // Act
    render(<Footer />);

    // Assert
    expect(screen.getByText("Budgets")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();

    // Assert that the mock was called and inspect the 'value' prop directly.
    expect(BottomNavigation).toHaveBeenCalled();
    const props = vi.mocked(BottomNavigation).mock.calls[0][0];
    expect(props.value).toBe(0);
  });

  it("should pass the correct value (1) for an analytics route", () => {
    // Arrange
    vi.mocked(usePathname).mockReturnValue("/analytics/details");

    // Act
    render(<Footer />);

    // Assert that the mock was called and inspect the 'value' prop.
    expect(BottomNavigation).toHaveBeenCalled();
    const props = vi.mocked(BottomNavigation).mock.calls[0][0];
    expect(props.value).toBe(1);
  });

  it("should call the router to navigate to /analytics when the value changes to 1", () => {
    // Arrange
    vi.mocked(usePathname).mockReturnValue("/budgets");
    render(<Footer />);

    // Act
    const { onChange } = vi.mocked(BottomNavigation).mock.calls[0][0];
    onChange({}, 1);

    // Assert
    expect(push).toHaveBeenCalledWith("/analytics");
  });

  it("should call the router to navigate to /budgets when the value changes to 0", () => {
    // Arrange
    vi.mocked(usePathname).mockReturnValue("/analytics");
    render(<Footer />);

    // Act
    const { onChange } = vi.mocked(BottomNavigation).mock.calls[0][0];
    onChange({}, 0);

    // Assert
    expect(push).toHaveBeenCalledWith("/budgets");
  });
});
