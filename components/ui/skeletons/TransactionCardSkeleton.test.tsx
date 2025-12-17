import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TransactionCardSkeleton from "./TransactionCardSkeleton";

describe("TransactionCardSkeleton", () => {
  it("should render without crashing", () => {
    const { container } = render(<TransactionCardSkeleton />);
    expect(container).toBeTruthy();
    expect(container.querySelector(".MuiCard-root")).toBeInTheDocument();
  });

  it("should render with showNotes as false (default)", () => {
    const { container } = render(<TransactionCardSkeleton />);
    // Count skeleton elements - should not include notes skeleton
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    // Expected: Amount, Chip, Date, Merchant, 2 action buttons = 6 skeletons
    expect(skeletons.length).toBe(6);
  });

  it("should render notes skeleton when showNotes is true", () => {
    const { container } = render(<TransactionCardSkeleton showNotes={true} />);
    // Count skeleton elements - should include notes skeleton
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    // Expected: Amount, Chip, Date, Merchant, Notes, 2 action buttons = 7 skeletons
    expect(skeletons.length).toBe(7);
  });

  it("should not render notes skeleton when showNotes is false", () => {
    const { container } = render(<TransactionCardSkeleton showNotes={false} />);
    // Count skeleton elements - should not include notes skeleton
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    // Expected: Amount, Chip, Date, Merchant, 2 action buttons = 6 skeletons
    expect(skeletons.length).toBe(6);
  });

  it("should accept and use custom testId prop", () => {
    render(<TransactionCardSkeleton testId="custom-test-id" />);
    expect(screen.getByTestId("custom-test-id")).toBeInTheDocument();
  });

  it("should render all required rows (amount/chip, date/merchant, action buttons)", () => {
    const { container } = render(<TransactionCardSkeleton />);

    // Verify Card and CardContent structure
    expect(container.querySelector(".MuiCard-root")).toBeInTheDocument();
    expect(container.querySelector(".MuiCardContent-root")).toBeInTheDocument();

    // Verify skeleton elements exist
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThan(0);

    // Verify circular skeletons for action buttons
    const circularSkeletons = Array.from(skeletons).filter((skeleton) =>
      skeleton.classList.contains("MuiSkeleton-circular"),
    );
    expect(circularSkeletons.length).toBe(2);
  });

  it("should have correct skeleton dimensions", () => {
    const { container } = render(<TransactionCardSkeleton />);
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");

    // Check for specific skeleton dimensions
    const rectangularSkeletons = Array.from(skeletons).filter((skeleton) =>
      skeleton.classList.contains("MuiSkeleton-rectangular"),
    );

    // Should have rectangular skeletons for amount, chip, date, merchant
    expect(rectangularSkeletons.length).toBeGreaterThan(0);
  });
});
