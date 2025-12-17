import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BudgetSummary from "@/components/features/budgets/BudgetSummary";
import { useBudgetSummary } from "@/hooks/features/budgets/useBudgetSummary";
import { BudgetSummary as BudgetSummaryType } from "@/types/api";

vi.mock("@/hooks/features/budgets/useBudgetSummary");
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));
vi.mock("@/components/features/budgets/BudgetSummaryTotals", () => ({
  default: ({ budget }: { budget: BudgetSummaryType | undefined }) => (
    <div data-testid="budget-summary-totals">{JSON.stringify(budget)}</div>
  ),
}));
vi.mock("@/components/features/budgets/BudgetCategories", () => ({
  default: ({ budget }: { budget: BudgetSummaryType | undefined }) => (
    <div data-testid="budget-categories">{JSON.stringify(budget)}</div>
  ),
}));

describe("BudgetSummary", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render loading states for individual sections", () => {
    vi.mocked(useBudgetSummary).mockReturnValue({
      budget: undefined,
      isLoading: true,
      error: undefined,
    });

    render(<BudgetSummary />);

    // Should render budget-summary container (not loading-skeleton)
    expect(screen.getByTestId("budget-summary")).toBeInTheDocument();

    // BudgetSummaryTotals and BudgetCategories are mocked and will render
    expect(screen.getByTestId("budget-summary-totals")).toBeInTheDocument();
    expect(screen.getByTestId("budget-categories")).toBeInTheDocument();
  });

  it("should redirect to the error page when there is an error", () => {
    vi.mocked(useBudgetSummary).mockReturnValue({
      budget: undefined,
      isLoading: false,
      error: new Error("test error"),
    });

    render(<BudgetSummary />);

    expect(mockPush).toHaveBeenCalledWith("/error");
  });

  it("should render the budget summary when data is loaded", () => {
    const budget = {
      id: "test-id",
      name: "test-name",
      month: 1,
      year: 2024,
      expectedIncome: 1000,
      actualIncome: 1200,
      expectedExpenses: 800,
      actualExpenses: 750,
      budgetItems: [],
    };
    vi.mocked(useBudgetSummary).mockReturnValue({
      budget,
      isLoading: false,
      error: undefined,
    });

    render(<BudgetSummary />);

    expect(screen.getByTestId("budget-summary")).toBeInTheDocument();
    expect(screen.getByTestId("budget-summary-totals")).toHaveTextContent(
      JSON.stringify(budget),
    );
    expect(screen.getByTestId("budget-categories")).toHaveTextContent(
      JSON.stringify(budget),
    );
  });

  it("should show sections even when loading", () => {
    const budget = {
      id: "test-id",
      name: "test-name",
      month: 1,
      year: 2024,
      expectedIncome: 1000,
      actualIncome: 1200,
      expectedExpenses: 800,
      actualExpenses: 750,
      budgetItems: [],
    };
    vi.mocked(useBudgetSummary).mockReturnValue({
      budget,
      isLoading: false,
      error: undefined,
    });

    render(<BudgetSummary />);

    // Both sections should render regardless of loading state
    expect(screen.getByTestId("budget-summary-totals")).toBeInTheDocument();
    expect(screen.getByTestId("budget-categories")).toBeInTheDocument();

    // The sections receive the budget data and manage their own loading states
    expect(screen.getByTestId("budget-summary-totals")).toHaveTextContent(
      JSON.stringify(budget),
    );
  });
});
