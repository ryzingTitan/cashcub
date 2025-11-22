import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BudgetSummaryTotals from "./BudgetSummaryTotals";
import { BudgetSummary } from "@/types/api";
import { formatToCurrency } from "@/lib/utils";

const mockBudget: BudgetSummary = {
  id: "1",
  name: "Test Budget",
  description: "Test Description",
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  expectedIncome: 5000,
  actualIncome: 5500,
  expectedExpenses: 3000,
  actualExpenses: 2500,
  categories: [],
};

describe("BudgetSummaryTotals", () => {
  it("should render skeleton loaders when loading", () => {
    render(<BudgetSummaryTotals isLoading={true} />);

    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("should render budget totals correctly", () => {
    render(<BudgetSummaryTotals budget={mockBudget} isLoading={false} />);

    expect(screen.getByTestId("expected-income")).toHaveTextContent(
      formatToCurrency(mockBudget.expectedIncome),
    );
    expect(screen.getByTestId("actual-income")).toHaveTextContent(
      formatToCurrency(mockBudget.actualIncome),
    );
    expect(screen.getByTestId("expected-expenses")).toHaveTextContent(
      formatToCurrency(mockBudget.expectedExpenses),
    );
    expect(screen.getByTestId("actual-expenses")).toHaveTextContent(
      formatToCurrency(mockBudget.actualExpenses),
    );
  });

  it("should calculate and display a positive gain/loss", () => {
    render(<BudgetSummaryTotals budget={mockBudget} isLoading={false} />);

    const gainLoss = mockBudget.actualIncome - mockBudget.actualExpenses;
    expect(screen.getByTestId("gain-loss")).toHaveTextContent(
      formatToCurrency(gainLoss),
    );
    expect(screen.getByTestId("gain-loss")).toHaveStyle({
      color: "rgb(46, 125, 50)",
    });
  });

  it("should calculate and display a negative gain/loss", () => {
    const budgetWithLoss: BudgetSummary = {
      ...mockBudget,
      actualIncome: 2000,
      actualExpenses: 2500,
    };
    render(<BudgetSummaryTotals budget={budgetWithLoss} isLoading={false} />);

    const gainLoss =
      budgetWithLoss.actualIncome - budgetWithLoss.actualExpenses;
    expect(screen.getByTestId("gain-loss")).toHaveTextContent(
      formatToCurrency(gainLoss),
    );
    expect(screen.getByTestId("gain-loss")).toHaveStyle({
      color: "rgb(211, 47, 47)",
    });
  });

  it("should calculate and display a zero gain/loss", () => {
    const budgetWithZeroGain: BudgetSummary = {
      ...mockBudget,
      actualIncome: 2500,
      actualExpenses: 2500,
    };
    render(
      <BudgetSummaryTotals budget={budgetWithZeroGain} isLoading={false} />,
    );

    const gainLoss =
      budgetWithZeroGain.actualIncome - budgetWithZeroGain.actualExpenses;
    expect(screen.getByTestId("gain-loss")).toHaveTextContent(
      formatToCurrency(gainLoss),
    );
    expect(screen.getByTestId("gain-loss")).toHaveStyle({
      color: "rgb(46, 125, 50)",
    });
  });
});
