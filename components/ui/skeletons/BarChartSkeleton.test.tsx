import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BarChartSkeleton from "./BarChartSkeleton";

describe("BarChartSkeleton", () => {
  it("should render without crashing", () => {
    const { container } = render(<BarChartSkeleton />);
    expect(container).toBeTruthy();
    expect(container.querySelector(".MuiBox-root")).toBeInTheDocument();
  });

  it("should render with default barCount (5 bars)", () => {
    const { container } = render(<BarChartSkeleton />);
    // Find all skeleton elements
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    // Expected: title + Y-axis + 5 bars + X-axis = 8 skeletons
    expect(skeletons.length).toBe(8);
  });

  it("should render correct number of bars when barCount prop changes", () => {
    const { container: container1 } = render(<BarChartSkeleton barCount={3} />);
    const skeletons1 = container1.querySelectorAll(".MuiSkeleton-root");
    // Expected: title + Y-axis + 3 bars + X-axis = 6 skeletons
    expect(skeletons1.length).toBe(6);

    const { container: container2 } = render(<BarChartSkeleton barCount={8} />);
    const skeletons2 = container2.querySelectorAll(".MuiSkeleton-root");
    // Expected: title + Y-axis + 8 bars + X-axis = 11 skeletons
    expect(skeletons2.length).toBe(11);

    const { container: container3 } = render(
      <BarChartSkeleton barCount={10} />,
    );
    const skeletons3 = container3.querySelectorAll(".MuiSkeleton-root");
    // Expected: title + Y-axis + 10 bars + X-axis = 13 skeletons
    expect(skeletons3.length).toBe(13);
  });

  it("should render with default height (300px)", () => {
    render(<BarChartSkeleton testId="bar-chart" />);
    const container = screen.getByTestId("bar-chart");
    expect(container).toHaveStyle({ height: "300px" });
  });

  it("should apply custom height prop", () => {
    render(<BarChartSkeleton height={400} testId="bar-chart" />);
    const container = screen.getByTestId("bar-chart");
    expect(container).toHaveStyle({ height: "400px" });
  });

  it("should accept and use custom testId prop", () => {
    render(<BarChartSkeleton testId="custom-test-id" />);
    expect(screen.getByTestId("custom-test-id")).toBeInTheDocument();
  });

  it("should render chart structure (title, Y-axis, bars, X-axis)", () => {
    const { container } = render(<BarChartSkeleton barCount={5} />);

    // Verify skeleton elements exist
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBe(8); // title + Y-axis + 5 bars + X-axis

    // Verify Box components for structure
    const boxes = container.querySelectorAll(".MuiBox-root");
    expect(boxes.length).toBeGreaterThan(0);

    // Verify Stack component exists (for bars)
    const stacks = container.querySelectorAll(".MuiStack-root");
    expect(stacks.length).toBeGreaterThan(0);

    // All skeletons should be rectangular variant
    skeletons.forEach((skeleton) => {
      expect(skeleton).toHaveClass("MuiSkeleton-rectangular");
    });
  });

  it("should have correct skeleton dimensions", () => {
    const { container } = render(<BarChartSkeleton />);
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");

    // First skeleton should be title (40% width, 28px height)
    expect(skeletons[0]).toHaveStyle({ width: "40%", height: "28px" });

    // Second skeleton should be Y-axis (75px width, 80% height)
    expect(skeletons[1]).toHaveStyle({ width: "75px", height: "80%" });

    // Last skeleton should be X-axis (calc(100% - 75px) width, 30px height)
    const lastSkeleton = skeletons[skeletons.length - 1];
    expect(lastSkeleton).toHaveStyle({ height: "30px" });
  });
});
