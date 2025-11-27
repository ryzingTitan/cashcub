import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BudgetCategories from "@/components/features/budgets/BudgetCategories";
import { SWRConfig } from "swr";
import { BudgetSummary, Category } from "@/types/api";
import { getAllCategories } from "@/lib/categories";

vi.mock("@/lib/categories", () => ({
  getAllCategories: vi.fn(),
}));

vi.mock("@/components/features/budgets/AddBudgetItemModal", () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="add-budget-item-modal-mock" />),
}));

vi.mock("@/components/features/budgets/BudgetItemSummary", () => ({
  __esModule: true,
  default: vi.fn(
    ({ budgetItem }: { budgetItem: { id: string; name: string } }) => (
      <div data-testid={`budget-item-${budgetItem.id}`}>{budgetItem.name}</div>
    ),
  ),
}));

vi.mock("@/components/ui/Transactions", () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="transactions-mock" />),
}));

const mockedGetAllCategories = vi.mocked(getAllCategories);

const mockCategories: Category[] = [
  { id: "cat1", name: "Groceries" },
  { id: "cat2", name: "Utilities" },
];

const mockBudget: BudgetSummary = {
  id: "budget1",
  month: 10,
  year: 2025,
  expectedIncome: 500,
  actualIncome: 400,
  expectedExpenses: 560,
  actualExpenses: 440,
  budgetItems: [
    {
      id: "item1",
      name: "Milk",
      plannedAmount: 10,
      actualAmount: 0,
      categoryId: "cat1",
      budgetId: "2",
    },
    {
      id: "item2",
      name: "Electricity",
      plannedAmount: 100,
      actualAmount: 0,
      categoryId: "cat2",
      budgetId: "2",
    },
  ],
};

describe("BudgetCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading skeleton when data is loading", () => {
    mockedGetAllCategories.mockReturnValue(new Promise(() => {})); // Never resolves

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <BudgetCategories budget={mockBudget} />
      </SWRConfig>,
    );
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("should render categories and budget items on successful data fetch", async () => {
    mockedGetAllCategories.mockResolvedValue(mockCategories);

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <BudgetCategories budget={mockBudget} />
      </SWRConfig>,
    );

    expect(await screen.findByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Utilities")).toBeInTheDocument();
    expect(screen.getByText("Milk")).toBeInTheDocument();
    expect(screen.getByText("Electricity")).toBeInTheDocument();
    expect(screen.getAllByTestId("add-budget-item-modal-mock")).toHaveLength(2);
  });

  it("should render no categories when data is empty", async () => {
    mockedGetAllCategories.mockResolvedValue([]);

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <BudgetCategories budget={mockBudget} />
      </SWRConfig>,
    );

    expect(screen.queryByTestId(/category-card-/)).toBeNull();
  });
});
