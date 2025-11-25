import { renderHook } from "@testing-library/react";
import { useBudgetItemGraph } from "./useBudgetItemGraph";
import { BudgetSummary } from "@/types/api";
import { describe, it, expect } from "vitest";

const mockBudgets: BudgetSummary[] = [
  {
    id: "1",
    month: 1,
    year: 2024,
    budgetItems: [
      {
        id: "bi1",
        budgetId: "1",
        name: "Groceries",
        plannedAmount: 500,
        actualAmount: 450,
        categoryId: "4",
      },
      {
        id: "bi2",
        budgetId: "1",
        name: "Rent",
        plannedAmount: 500,
        actualAmount: 350,
        categoryId: "5",
      },
    ],
    expectedIncome: 0,
    actualIncome: 0,
    expectedExpenses: 0,
    actualExpenses: 0,
  },
  {
    id: "2",
    month: 2,
    year: 2024,
    budgetItems: [
      {
        id: "bi3",
        budgetId: "2",
        name: "Groceries",
        plannedAmount: 600,
        actualAmount: 550,
        categoryId: "4",
      },
      {
        id: "bi4",
        budgetId: "2",
        name: "Utilities",
        plannedAmount: 600,
        actualAmount: 550,
        categoryId: "5",
      },
    ],
    expectedIncome: 0,
    actualIncome: 0,
    expectedExpenses: 0,
    actualExpenses: 0,
  },
];

describe("useBudgetItemGraph", () => {
  it("should return empty arrays for undefined budgets", () => {
    const { result } = renderHook(() => useBudgetItemGraph(undefined));
    expect(result.current.chartData).toEqual([]);
    expect(result.current.itemKeys).toEqual([]);
  });

  it("should process budget data correctly", () => {
    const { result } = renderHook(() => useBudgetItemGraph(mockBudgets));
    const { chartData, itemKeys } = result.current;

    expect(itemKeys).toEqual(["Groceries", "Rent", "Utilities"]);
    expect(chartData).toEqual([
      {
        x: "1/2024",
        Groceries: 450,
        Rent: 350,
        Utilities: 0,
      },
      {
        x: "2/2024",
        Groceries: 550,
        Rent: 0,
        Utilities: 550,
      },
    ]);
  });

  it("should use planned amount when actual amount is not available", () => {
    const budgetWithPlanned: BudgetSummary[] = [
      {
        ...mockBudgets[0],
        budgetItems: [
          {
            id: "bi1",
            budgetId: "1",
            name: "Groceries",
            plannedAmount: 500,
            actualAmount: null,
            categoryId: "4",
          },
        ],
      },
    ];
    const { result } = renderHook(() => useBudgetItemGraph(budgetWithPlanned));
    expect(result.current.chartData[0].Groceries).toBe(500);
  });
});
