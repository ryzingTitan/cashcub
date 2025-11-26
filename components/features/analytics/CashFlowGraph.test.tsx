import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CashFlowGraph from "./CashFlowGraph";
import { BudgetSummary } from "@/types/api";
import { LineChartProps } from "@mui/x-charts";

// Mock the LineChart component
vi.mock("@mui/x-charts", () => ({
  LineChart: (props: LineChartProps) => {
    if (props.loading) {
      return <div data-testid="loading-chart">Loading...</div>;
    }
    return <div data-testid="mock-chart">{JSON.stringify(props.dataset)}</div>;
  },
}));

const mockBudgets: BudgetSummary[] = [
  {
    id: "1",
    month: 1,
    year: 2024,
    expectedIncome: 5000,
    expectedExpenses: 3200,
    actualIncome: 5200,
    actualExpenses: 2800,
    budgetItems: [],
  },
  {
    id: "2",
    month: 2,
    year: 2024,
    expectedIncome: 5100,
    expectedExpenses: 3100,
    actualIncome: 5300,
    actualExpenses: 2900,
    budgetItems: [],
  },
];

describe("CashFlowGraph", () => {
  it("renders loading state", () => {
    render(<CashFlowGraph budgets={[]} loading={true} />);
    expect(screen.getByTestId("loading-chart")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<CashFlowGraph budgets={[]} loading={false} />);
    expect(
      screen.getByText("No cash flow data to display."),
    ).toBeInTheDocument();
  });

  it("renders the chart with correct data", () => {
    render(<CashFlowGraph budgets={mockBudgets} loading={false} />);
    const chart = screen.getByTestId("mock-chart");
    expect(chart).toBeInTheDocument();

    const expectedData = [
      { x: "1/2024", actualIncome: 5200, actualExpenses: 2800 },
      { x: "2/2024", actualIncome: 10500, actualExpenses: 5700 },
    ];
    expect(JSON.parse(chart.textContent!)).toEqual(expectedData);
  });
});
