import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CardSkeleton from "./CardSkeleton";

describe("CardSkeleton", () => {
  it("should render without crashing", () => {
    const { container } = render(<CardSkeleton />);
    expect(container).toBeTruthy();
    expect(container.querySelector(".MuiCard-root")).toBeInTheDocument();
  });

  it("should render with default props (no header, default content)", () => {
    const { container } = render(<CardSkeleton />);
    expect(container.querySelector(".MuiCard-root")).toBeInTheDocument();
    expect(container.querySelector(".MuiCardContent-root")).toBeInTheDocument();
    // Should have at least one skeleton element (default content)
    expect(
      container.querySelectorAll(".MuiSkeleton-root").length,
    ).toBeGreaterThan(0);
  });

  it("should accept and use custom testId prop", () => {
    render(<CardSkeleton testId="custom-test-id" />);
    expect(screen.getByTestId("custom-test-id")).toBeInTheDocument();
  });

  it("should render header when showHeader is true", () => {
    const { container } = render(<CardSkeleton showHeader={true} />);
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    // Should have more than one skeleton (header + content)
    expect(skeletons.length).toBeGreaterThan(1);
  });

  it("should not render header when showHeader is false or undefined", () => {
    const { container } = render(<CardSkeleton showHeader={false} />);
    // Without children, should only have 1 skeleton element (default content)
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBe(1);
  });

  it("should apply custom height prop", () => {
    render(<CardSkeleton height={400} testId="card-skeleton" />);
    const card = screen.getByTestId("card-skeleton");
    expect(card).toHaveStyle({ height: "400px" });
  });

  it("should apply custom headerHeight prop", () => {
    const { container } = render(
      <CardSkeleton showHeader={true} headerHeight={40} />,
    );
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    // First skeleton should be the header with custom height
    expect(skeletons[0]).toHaveStyle({ height: "40px" });
  });

  it("should render children when provided", () => {
    render(
      <CardSkeleton testId="card-skeleton">
        <div data-testid="custom-content">Custom Content</div>
      </CardSkeleton>,
    );
    expect(screen.getByTestId("custom-content")).toBeInTheDocument();
    expect(screen.getByText("Custom Content")).toBeInTheDocument();
  });
});
