import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BudgetCategories from "@/components/BudgetCategories";
import { SWRConfig } from "swr";
import { BudgetSummary, Category } from "@/types/api";

vi.mock("@/components/AddBudgetItemModal", () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="add-budget-item-modal-mock" />),
}));

vi.mock("@/components/Transactions", () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="transactions-mock" />),
}));

const mockCategories: Category[] = [
  { id: "cat1", name: "Groceries", budgetItems: [] },
  { id: "cat2", name: "Utilities", budgetItems: [] },
];

const mockBudget: BudgetSummary = {
  id: "budget1",
  name: "Monthly Budget",
  budgetItems: [
    {
      id: "item1",
      name: "Milk",
      plannedAmount: 10,
      actualAmount: 0,
      categoryId: "cat1",
    },
    {
      id: "item2",
      name: "Electricity",
      plannedAmount: 100,
      actualAmount: 0,
      categoryId: "cat2",
    },
  ],
  startDate: new Date(),
  endDate: new Date(),
};

describe("BudgetCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading skeleton when data is loading", () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <BudgetCategories budget={mockBudget} />
      </SWRConfig>
    );
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("should render categories and budget items on successful data fetch", async () => {
    render(
      <SWRConfig
        value={{
          provider: () => new Map([["/categories", { data: mockCategories }]]),
        }}
      >
        <BudgetCategories budget={mockBudget} />
      </SWRConfig>
    );

    expect(await screen.findByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Utilities")).toBeInTheDocument();
    expect(screen.getByText("Milk")).toBeInTheDocument();
    expect(screen.getByText("Electricity")).toBeInTheDocument();
    expect(
      screen.getAllByTestId("add-budget-item-modal-mock")
    ).toHaveLength(2);
  });

  it("should render no categories when data is empty", async () => {
    render(
      <SWRConfig
        value={{
          provider: () => new Map([["/categories", { data: [] }]]),
        }}
      >
        <BudgetCategories budget={mockBudget} />
      </SWRConfig>
    );

    expect(await screen.queryByTestId(/category-card-/)).toBeNull();
  });
});
