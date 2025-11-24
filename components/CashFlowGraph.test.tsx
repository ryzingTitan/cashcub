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
    userId: "user1",
    month: 1,
    year: 2024,
    totalIncome: 5000,
    totalExpenses: 3000,
    totalSavings: 2000,
    expectedIncome: 5000,
    expectedExpenses: 3200,
    expectedSavings: 1800,
    actualIncome: 5200,
    actualExpenses: 2800,
    actualSavings: 2400,
    version: 1,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    userId: "user1",
    month: 2,
    year: 2024,
    totalIncome: 5100,
    totalExpenses: 3100,
    totalSavings: 2000,
    expectedIncome: 5100,
    expectedExpenses: 3100,
    expectedSavings: 2000,
    actualIncome: 5300,
    actualExpenses: 2900,
    actualSavings: 2400,
    version: 1,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
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
