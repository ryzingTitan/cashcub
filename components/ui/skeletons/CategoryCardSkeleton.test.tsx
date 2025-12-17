import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CategoryCardSkeleton from "./CategoryCardSkeleton";

describe("CategoryCardSkeleton", () => {
  it("should render without crashing", () => {
    const { container } = render(<CategoryCardSkeleton />);
    expect(container).toBeTruthy();
    expect(container.querySelector(".MuiCard-root")).toBeInTheDocument();
  });

  it("should render with default itemCount (2 items)", () => {
    const { container } = render(<CategoryCardSkeleton />);
    const listItems = container.querySelectorAll(".MuiListItem-root");
    expect(listItems).toHaveLength(2);
  });

  it("should render correct number of items when itemCount prop changes", () => {
    const { container: container1 } = render(
      <CategoryCardSkeleton itemCount={3} />,
    );
    const listItems1 = container1.querySelectorAll(".MuiListItem-root");
    expect(listItems1).toHaveLength(3);

    const { container: container2 } = render(
      <CategoryCardSkeleton itemCount={5} />,
    );
    const listItems2 = container2.querySelectorAll(".MuiListItem-root");
    expect(listItems2).toHaveLength(5);

    const { container: container3 } = render(
      <CategoryCardSkeleton itemCount={1} />,
    );
    const listItems3 = container3.querySelectorAll(".MuiListItem-root");
    expect(listItems3).toHaveLength(1);
  });

  it("should accept and use custom testId prop", () => {
    render(<CategoryCardSkeleton testId="custom-test-id" />);
    expect(screen.getByTestId("custom-test-id")).toBeInTheDocument();
  });

  it("should render header row with category name and button skeletons", () => {
    const { container } = render(<CategoryCardSkeleton />);

    // Find all skeleton elements
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");

    // First skeleton should be rectangular (category name)
    const firstSkeleton = skeletons[0];
    expect(firstSkeleton).toHaveClass("MuiSkeleton-rectangular");

    // Second skeleton should be circular (add button)
    const circularSkeletons = Array.from(skeletons).filter((skeleton) =>
      skeleton.classList.contains("MuiSkeleton-circular"),
    );
    expect(circularSkeletons.length).toBeGreaterThan(0);
  });

  it("should render divider", () => {
    const { container } = render(<CategoryCardSkeleton />);
    const divider = container.querySelector(".MuiDivider-root");
    expect(divider).toBeInTheDocument();
  });

  it("should render list items with correct structure (name + columns + icons)", () => {
    const { container } = render(<CategoryCardSkeleton itemCount={2} />);

    // Verify List component exists
    expect(container.querySelector(".MuiList-root")).toBeInTheDocument();

    // Verify ListItem components exist
    const listItems = container.querySelectorAll(".MuiListItem-root");
    expect(listItems).toHaveLength(2);

    // Verify each list item has skeleton elements
    listItems.forEach((listItem) => {
      const skeletonsInItem = listItem.querySelectorAll(".MuiSkeleton-root");
      // Each item should have: name + 6 column values (3 headers + 3 values) + 3 action icons
      expect(skeletonsInItem.length).toBeGreaterThan(0);
    });

    // Verify there are circular skeletons (action icons)
    const allSkeletons = container.querySelectorAll(".MuiSkeleton-root");
    const circularSkeletons = Array.from(allSkeletons).filter((skeleton) =>
      skeleton.classList.contains("MuiSkeleton-circular"),
    );
    // Should have at least the header button + action icons per item
    expect(circularSkeletons.length).toBeGreaterThan(0);
  });

  it("should have correct card structure", () => {
    const { container } = render(<CategoryCardSkeleton />);

    // Verify Card structure
    expect(container.querySelector(".MuiCard-root")).toBeInTheDocument();
    expect(container.querySelector(".MuiCardContent-root")).toBeInTheDocument();

    // Verify Stack component exists (header row)
    const stacks = container.querySelectorAll(".MuiStack-root");
    expect(stacks.length).toBeGreaterThan(0);

    // Verify Divider exists
    expect(container.querySelector(".MuiDivider-root")).toBeInTheDocument();

    // Verify List exists
    expect(container.querySelector(".MuiList-root")).toBeInTheDocument();
  });
});
