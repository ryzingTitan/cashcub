"use client";

import { render, screen } from "@testing-library/react";
import Budget from "./page";
import { vi, describe, it, expect, beforeEach } from "vitest";
import BudgetSummary from "@/components/features/budgets/BudgetSummary";

// Automatically mock the child components
vi.mock("@/components/features/budgets/BudgetSummary");
vi.mock("@/components/ui/Transactions", () => ({
  __esModule: true,
  default: () => <div data-testid="transactions" />,
}));
vi.mock("@/components/ui/AddTransactionModal", () => ({
  __esModule: true,
  default: () => <div data-testid="add-transaction-modal" />,
}));

describe("Budget page", () => {
  beforeEach(() => {
    // Reset the mock and provide a default implementation for each test
    vi.mocked(BudgetSummary).mockClear();
    vi.mocked(BudgetSummary).mockReturnValue(
      <div data-testid="budget-summary" />,
    );
    document.body.innerHTML = "";
  });

  it("should render the page with all components", () => {
    render(<Budget />);

    expect(screen.getByTestId("budget-summary")).toBeInTheDocument();
    expect(screen.getByTestId("add-transaction-modal")).toBeInTheDocument();
  });

  it("should render the loading state", () => {
    vi.mocked(BudgetSummary).mockReturnValue(
      <div data-testid="budget-summary">Loading...</div>,
    );
    render(<Budget />);
    expect(screen.getByTestId("budget-summary")).toHaveTextContent(
      "Loading...",
    );
  });

  it("should render the error state", () => {
    vi.mocked(BudgetSummary).mockReturnValue(
      <div data-testid="budget-summary">Error</div>,
    );
    render(<Budget />);
    expect(screen.getByTestId("budget-summary")).toHaveTextContent("Error");
  });
});
