import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BudgetSummary from "@/components/BudgetSummary";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { BudgetSummary as BudgetSummaryType } from "@/types/api";

vi.mock("@/hooks/useBudgetSummary");
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));
vi.mock("@/components/BudgetSummaryTotals", () => ({
  default: ({ budget }: { budget: BudgetSummaryType | undefined }) => (
    <div data-testid="budget-summary-totals">{JSON.stringify(budget)}</div>
  ),
}));
vi.mock("@/components/BudgetCategories", () => ({
  default: ({ budget }: { budget: BudgetSummaryType | undefined }) => (
    <div data-testid="budget-categories">{JSON.stringify(budget)}</div>
  ),
}));

describe("BudgetSummary", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render the loading skeleton when loading", () => {
    vi.mocked(useBudgetSummary).mockReturnValue({
      budget: undefined,
      isLoading: true,
      error: undefined,
    });

    render(<BudgetSummary />);

    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
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
});
