"use client";

import { render, screen } from "@testing-library/react";
import BudgetLayout from "./layout";
import { vi, describe, it, expect, beforeEach } from "vitest";
import BudgetList from "@/components/BudgetList";

// Automatically mock the child component that's causing issues
vi.mock("@/components/BudgetList");

// Mock other simple components with an inline factory
vi.mock("@/components/AddBudgetModal", () => ({
  __esModule: true,
  default: () => <div data-testid="add-budget-modal" />,
}));
vi.mock("@/components/CloneBudgetModal", () => ({
  __esModule: true,
  default: () => <div data-testid="clone-budget-modal" />,
}));
vi.mock("./components/BudgetsLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="budgets-layout">{children}</div>
  ),
}));

describe("BudgetLayout", () => {
  beforeEach(() => {
    // Reset the mock and provide a default implementation for each test
    vi.mocked(BudgetList).mockClear();
    vi.mocked(BudgetList).mockReturnValue(<div data-testid="budget-list" />);
    document.body.innerHTML = "";
  });

  it("should render the layout with all components and children", () => {
    render(
      <BudgetLayout>
        <div>Child Component</div>
      </BudgetLayout>,
    );

    expect(screen.getByTestId("budgets-layout")).toBeInTheDocument();
    expect(screen.getByTestId("budget-list")).toBeInTheDocument();
    expect(screen.getByTestId("add-budget-modal")).toBeInTheDocument();
    expect(screen.getByTestId("clone-budget-modal")).toBeInTheDocument();
    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  it("should render correctly when there are no budgets", () => {
    // Provide a different implementation for this specific test case
    vi.mocked(BudgetList).mockReturnValue(
      <div data-testid="budget-list">No budgets found.</div>,
    );

    render(
      <BudgetLayout>
        <div>Child Component</div>
      </BudgetLayout>,
    );

    expect(screen.getByTestId("budget-list")).toHaveTextContent(
      "No budgets found.",
    );
  });
});
