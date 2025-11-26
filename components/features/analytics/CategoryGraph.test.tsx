import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import CategoryGraph from "./CategoryGraph";
import { SWRConfig } from "swr";
import { BudgetSummary, Category } from "@/types/api";
import { getAllCategories } from "@/lib/categories";

vi.mock("@/lib/categories");

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockCategories: Category[] = [
  { id: "1", name: "Groceries" },
  { id: "2", name: "Rent" },
];

const mockBudgets: BudgetSummary[] = [
  {
    id: "1",
    month: 10,
    year: 2025,
    expectedExpenses: 500,
    actualExpenses: 450,
    expectedIncome: 700,
    actualIncome: 750,
    budgetItems: [
      {
        id: "1",
        name: "Grocery Shopping",
        plannedAmount: 500,
        actualAmount: 450,
        categoryId: "1",
        budgetId: "1",
      },
      {
        id: "2",
        name: "Monthly Rent",
        plannedAmount: 1500,
        actualAmount: 1500,
        categoryId: "2",
        budgetId: "1",
      },
    ],
  },
];

describe("CategoryGraph", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display a loading state while fetching categories", () => {
    vi.mocked(getAllCategories).mockImplementation(() => new Promise(() => {}));
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <CategoryGraph budgets={mockBudgets} />
      </SWRConfig>,
    );
    expect(screen.getByText("Loading data…")).toBeInTheDocument();
  });

  it("should render the pie chart with correct data on success", async () => {
    vi.mocked(getAllCategories).mockResolvedValue(mockCategories);
    render(
      <SWRConfig
        value={{
          provider: () => new Map(),
        }}
      >
        <CategoryGraph budgets={mockBudgets} />
      </SWRConfig>,
    );

    await waitFor(() => {
      expect(screen.getByText("Totals by Category")).toBeInTheDocument();
      expect(screen.getByText("Groceries")).toBeInTheDocument();
      expect(screen.getByText("Rent")).toBeInTheDocument();
    });
  });

  it("should redirect to the error page when fetching categories fails", async () => {
    vi.mocked(getAllCategories).mockRejectedValue(new Error("API Error"));
    render(
      <SWRConfig
        value={{ provider: () => new Map(), revalidateOnFocus: false }}
      >
        <CategoryGraph budgets={mockBudgets} />
      </SWRConfig>,
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/error");
    });
  });

  it("should render an empty state when no budget data is provided", async () => {
    vi.mocked(getAllCategories).mockResolvedValue(mockCategories);
    render(
      <SWRConfig
        value={{
          provider: () => new Map(),
        }}
      >
        <CategoryGraph budgets={[]} />
      </SWRConfig>,
    );
    await waitFor(() => {
      expect(screen.getByText("Totals by Category")).toBeInTheDocument();
      expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
    });
  });
});
