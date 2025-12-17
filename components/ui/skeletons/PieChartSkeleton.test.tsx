import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PieChartSkeleton from "./PieChartSkeleton";

describe("PieChartSkeleton", () => {
  it("should render without crashing", () => {
    const { container } = render(<PieChartSkeleton />);
    expect(container).toBeTruthy();
    expect(container.querySelector(".MuiBox-root")).toBeInTheDocument();
  });

  it("should render with default legendItemCount (5 items)", () => {
    const { container } = render(<PieChartSkeleton />);
    // Find all skeleton elements
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    // Expected: title + circular + (5 legend items × 2 skeletons each) = 1 + 1 + 10 = 12 skeletons
    expect(skeletons.length).toBe(12);
  });

  it("should render correct number of legend items when legendItemCount prop changes", () => {
    const { container: container1 } = render(<PieChartSkeleton legendItemCount={3} />);
    const skeletons1 = container1.querySelectorAll(".MuiSkeleton-root");
    // Expected: title + circular + (3 items × 2) = 8 skeletons
    expect(skeletons1.length).toBe(8);

    const { container: container2 } = render(<PieChartSkeleton legendItemCount={7} />);
    const skeletons2 = container2.querySelectorAll(".MuiSkeleton-root");
    // Expected: title + circular + (7 items × 2) = 16 skeletons
    expect(skeletons2.length).toBe(16);

    const { container: container3 } = render(<PieChartSkeleton legendItemCount={4} />);
    const skeletons3 = container3.querySelectorAll(".MuiSkeleton-root");
    // Expected: title + circular + (4 items × 2) = 10 skeletons
    expect(skeletons3.length).toBe(10);
  });

  it("should render with default height (300px)", () => {
    render(<PieChartSkeleton testId="pie-chart" />);
    const container = screen.getByTestId("pie-chart");
    expect(container).toHaveStyle({ height: "300px" });
  });

  it("should apply custom height prop", () => {
    render(<PieChartSkeleton height={400} testId="pie-chart" />);
    const container = screen.getByTestId("pie-chart");
    expect(container).toHaveStyle({ height: "400px" });
  });

  it("should accept and use custom testId prop", () => {
    render(<PieChartSkeleton testId="custom-test-id" />);
    expect(screen.getByTestId("custom-test-id")).toBeInTheDocument();
  });

  it("should render chart structure (title, circular skeleton, legend)", () => {
    const { container } = render(<PieChartSkeleton legendItemCount={5} />);

    // Verify skeleton elements exist
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBe(12); // title + circular + (5 items × 2)

    // Verify Box components for structure
    const boxes = container.querySelectorAll(".MuiBox-root");
    expect(boxes.length).toBeGreaterThan(0);

    // Verify Stack components exist (for legend)
    const stacks = container.querySelectorAll(".MuiStack-root");
    expect(stacks.length).toBeGreaterThan(0);

    // First skeleton should be title (rectangular)
    expect(skeletons[0]).toHaveClass("MuiSkeleton-rectangular");
    expect(skeletons[0]).toHaveStyle({ width: "40%", height: "28px" });

    // Second skeleton should be circular (pie chart)
    expect(skeletons[1]).toHaveClass("MuiSkeleton-circular");

    // Verify there is exactly 1 circular skeleton
    const circularSkeletons = Array.from(skeletons).filter((skeleton) =>
      skeleton.classList.contains("MuiSkeleton-circular")
    );
    expect(circularSkeletons.length).toBe(1);

    // Verify circular skeleton has correct size (200px diameter)
    expect(circularSkeletons[0]).toHaveStyle({ width: "200px", height: "200px" });
  });

  it("should render legend items with correct structure", () => {
    const { container } = render(<PieChartSkeleton legendItemCount={5} />);

    const skeletons = container.querySelectorAll(".MuiSkeleton-root");

    // Skip first 2 skeletons (title and circular), rest are legend items
    const legendSkeletons = Array.from(skeletons).slice(2);
    expect(legendSkeletons.length).toBe(10); // 5 items × 2 skeletons each

    // Each pair should be: color box (16px square) + label (100px × 20px)
    // Verify rectangular skeletons (excluding title) for legend items
    const rectangularSkeletons = Array.from(skeletons).filter(
      (skeleton, index) =>
        index > 0 && skeleton.classList.contains("MuiSkeleton-rectangular")
    );

    expect(rectangularSkeletons.length).toBeGreaterThan(0);
  });
});
