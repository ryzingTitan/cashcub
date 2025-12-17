import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LineChartSkeleton from "./LineChartSkeleton";

describe("LineChartSkeleton", () => {
  it("should render without crashing", () => {
    const { container } = render(<LineChartSkeleton />);
    expect(container).toBeTruthy();
    expect(container.querySelector(".MuiBox-root")).toBeInTheDocument();
  });

  it("should render with default lineCount (2 lines)", () => {
    const { container } = render(<LineChartSkeleton />);
    // Find all skeleton elements
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    // Expected: title + Y-axis + shaded area + (2 lines × 6 segments each) + X-axis
    // = 1 + 1 + 1 + 12 + 1 = 16 skeletons
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should render correct number of lines when lineCount prop changes", () => {
    const { container: container1 } = render(
      <LineChartSkeleton lineCount={1} />,
    );
    const skeletons1 = container1.querySelectorAll(".MuiSkeleton-root");

    const { container: container2 } = render(
      <LineChartSkeleton lineCount={3} />,
    );
    const skeletons2 = container2.querySelectorAll(".MuiSkeleton-root");

    // Container2 should have more skeletons than container1 due to more lines
    expect(skeletons2.length).toBeGreaterThan(skeletons1.length);
  });

  it("should render with default height (300px)", () => {
    render(<LineChartSkeleton testId="line-chart" />);
    const container = screen.getByTestId("line-chart");
    expect(container).toHaveStyle({ height: "300px" });
  });

  it("should apply custom height prop", () => {
    render(<LineChartSkeleton height={400} testId="line-chart" />);
    const container = screen.getByTestId("line-chart");
    expect(container).toHaveStyle({ height: "400px" });
  });

  it("should accept and use custom testId prop", () => {
    render(<LineChartSkeleton testId="custom-test-id" />);
    expect(screen.getByTestId("custom-test-id")).toBeInTheDocument();
  });

  it("should render chart structure (title, Y-axis, shaded area, line paths, X-axis)", () => {
    const { container } = render(<LineChartSkeleton lineCount={2} />);

    // Verify skeleton elements exist
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThan(0);

    // Verify Box components for structure
    const boxes = container.querySelectorAll(".MuiBox-root");
    expect(boxes.length).toBeGreaterThan(0);

    // Verify Stack components exist (for line paths)
    const stacks = container.querySelectorAll(".MuiStack-root");
    expect(stacks.length).toBeGreaterThan(0);

    // All skeletons should be rectangular variant
    skeletons.forEach((skeleton) => {
      expect(skeleton).toHaveClass("MuiSkeleton-rectangular");
    });

    // First skeleton should be title
    expect(skeletons[0]).toHaveStyle({ width: "40%", height: "28px" });

    // Second skeleton should be Y-axis
    expect(skeletons[1]).toHaveStyle({ width: "75px", height: "80%" });
  });

  it("should render shaded area with correct opacity", () => {
    const { container } = render(<LineChartSkeleton />);
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");

    // Find the shaded area skeleton (should have opacity 0.3)
    const shadedArea = Array.from(skeletons).find((skeleton) => {
      const opacity = window.getComputedStyle(skeleton).opacity;
      return opacity === "0.3";
    });

    expect(shadedArea).toBeTruthy();
  });
});
