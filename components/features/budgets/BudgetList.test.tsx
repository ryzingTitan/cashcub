import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BudgetList from "./BudgetList";
import { useBudgetList } from "@/hooks/features/budgets/useBudgetList";
import { Budget } from "@/types/api";

// Mock the hook
vi.mock("@/hooks/features/budgets/useBudgetList");

const mockedUseBudgetList = vi.mocked(useBudgetList);

describe("BudgetList", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  it("should render the skeleton loader when loading", () => {
    mockedUseBudgetList.mockReturnValue({
      budgets: [],
      isLoading: true,
      selectedBudget: null,
      handleBudgetChange: vi.fn(),
      getOptionLabel: vi.fn(),
    });

    render(<BudgetList />);

    expect(screen.getByTestId("budget-list-skeleton")).toBeInTheDocument();
  });

  it("should render the Autocomplete component with budgets when loaded", () => {
    const mockBudgets = [
      { id: "1", year: 2024, month: 1 },
      { id: "2", year: 2024, month: 2 },
    ];
    const getOptionLabel = (option: Budget) => `${option.id}`;

    mockedUseBudgetList.mockReturnValue({
      budgets: mockBudgets,
      isLoading: false,
      selectedBudget: null,
      handleBudgetChange: vi.fn(),
      getOptionLabel,
    });

    render(<BudgetList />);

    expect(screen.getByLabelText("Budget")).toBeInTheDocument();
    // Further tests could involve interacting with the Autocomplete,
    // but that is more about testing the hook's functionality.
  });

  it("should render the Autocomplete component with no options when there are no budgets", () => {
    mockedUseBudgetList.mockReturnValue({
      budgets: [],
      isLoading: false,
      selectedBudget: null,
      handleBudgetChange: vi.fn(),
      getOptionLabel: vi.fn(),
    });

    render(<BudgetList />);

    expect(screen.getByLabelText("Budget")).toBeInTheDocument();
  });
});
