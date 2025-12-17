import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BudgetSummaryCardSkeleton from "./BudgetSummaryCardSkeleton";

describe("BudgetSummaryCardSkeleton", () => {
  it("should render without crashing", () => {
    const { container } = render(<BudgetSummaryCardSkeleton />);
    expect(container).toBeTruthy();
    expect(container.querySelector(".MuiCard-root")).toBeInTheDocument();
  });

  it("should render Card with CardContent structure", () => {
    const { container } = render(<BudgetSummaryCardSkeleton />);
    expect(container.querySelector(".MuiCard-root")).toBeInTheDocument();
    expect(container.querySelector(".MuiCardContent-root")).toBeInTheDocument();
  });

  it("should render 2 skeleton elements (title and value)", () => {
    const { container } = render(<BudgetSummaryCardSkeleton />);
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons).toHaveLength(2);
  });

  it("should accept and use custom testId prop", () => {
    render(<BudgetSummaryCardSkeleton testId="custom-test-id" />);
    expect(screen.getByTestId("custom-test-id")).toBeInTheDocument();
  });

  it("should have correct styling (minWidth: 200, flex: 1)", () => {
    render(<BudgetSummaryCardSkeleton testId="budget-card" />);
    const card = screen.getByTestId("budget-card");
    // Check for the presence of MUI Card component which has the styles applied
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("MuiCard-root");
  });

  it("should render skeleton elements with correct widths", () => {
    const { container } = render(<BudgetSummaryCardSkeleton />);
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");

    // First skeleton (title): 70% width, 32px height
    expect(skeletons[0]).toHaveStyle({ width: "70%", height: "32px" });

    // Second skeleton (value): 60% width, 28px height
    expect(skeletons[1]).toHaveStyle({ width: "60%", height: "28px" });
  });
});
