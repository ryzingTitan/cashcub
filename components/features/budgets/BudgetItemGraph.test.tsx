import { render, screen } from "@testing-library/react";
import BudgetItemGraph from "./BudgetItemGraph";
import { useBudgetItemGraph } from "@/hooks/features/budgets/useBudgetItemGraph";
import { vi, describe, it, expect } from "vitest";

vi.mock("@/hooks/features/budgets/useBudgetItemGraph");

const mockUseBudgetItemGraph = vi.mocked(useBudgetItemGraph);

describe("BudgetItemGraph", () => {
  it("should render the skeleton when loading", () => {
    mockUseBudgetItemGraph.mockReturnValue({ chartData: [], itemKeys: [] });
    render(<BudgetItemGraph budgets={[]} loading={true} />);
    expect(
      screen.getByTestId("budget-item-graph-skeleton"),
    ).toBeInTheDocument();
  });

  it("should render the chart with data", () => {
    mockUseBudgetItemGraph.mockReturnValue({
      chartData: [],
      itemKeys: ["Groceries", "Rent", "Utilities"],
    });
    render(<BudgetItemGraph budgets={[]} loading={false} />);
    expect(screen.getByText("Totals by Budget Item")).toBeInTheDocument();
  });
});
