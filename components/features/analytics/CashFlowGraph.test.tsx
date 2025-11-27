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

  it("sorts budgets across multiple years correctly", () => {
    const multiYearBudgets: BudgetSummary[] = [
      {
        id: "3",
        month: 12,
        year: 2024,
        expectedIncome: 6000,
        expectedExpenses: 3500,
        actualIncome: 6200,
        actualExpenses: 3200,
        budgetItems: [],
      },
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
        id: "4",
        month: 1,
        year: 2025,
        expectedIncome: 5500,
        expectedExpenses: 3300,
        actualIncome: 5700,
        actualExpenses: 3100,
        budgetItems: [],
      },
    ];

    render(<CashFlowGraph budgets={multiYearBudgets} loading={false} />);
    const chart = screen.getByTestId("mock-chart");
    const data = JSON.parse(chart.textContent!);

    // Verify the budgets are sorted correctly (2024/1, then 2024/12, then 2025/1)
    expect(data[0].x).toBe("1/2024");
    expect(data[1].x).toBe("12/2024");
    expect(data[2].x).toBe("1/2025");

    // Verify cumulative totals
    expect(data[0].actualIncome).toBe(5200);
    expect(data[1].actualIncome).toBe(11400); // 5200 + 6200
    expect(data[2].actualIncome).toBe(17100); // 11400 + 5700
  });
});
