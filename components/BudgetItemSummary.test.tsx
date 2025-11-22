import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BudgetItemSummary from "./BudgetItemSummary";
import { BudgetItem } from "@/types/api";
import { SWRConfig } from "swr";

const mockBudgetItem: BudgetItem = {
  id: "1",
  budgetId: "1",
  categoryId: "1",
  name: "Groceries",
  plannedAmount: 500,
  actualAmount: 250,
};

const mockMutate = vi.fn();
const mockEnqueueSnackbar = vi.fn();

vi.mock("swr", async (importOriginal) => {
  const original = await importOriginal<typeof import("swr")>();
  return {
    ...original,
    useSWRConfig: () => ({
      mutate: mockMutate,
    }),
  };
});

vi.mock("notistack", () => ({
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueueSnackbar,
  }),
}));

vi.mock("@/lib/budgets", () => ({
  updateBudgetItem: vi.fn(),
  deleteBudgetItem: vi.fn(),
}));

vi.mock("@/components/Transactions", () => ({
  __esModule: true,
  default: () => <div data-testid="transactions-mock" />,
}));

describe("BudgetItemSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component in view mode", () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <BudgetItemSummary budgetItem={mockBudgetItem} categoryName="Expense" />
      </SWRConfig>,
    );

    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByTestId("planned-amount")).toHaveTextContent("$500.00");
    expect(screen.getByTestId("actual-amount")).toHaveTextContent("$250.00");
    expect(screen.getByTestId("remaining-amount")).toHaveTextContent(
      "$250.00",
    );
  });

  it("should toggle to edit mode when edit button is clicked", async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <BudgetItemSummary budgetItem={mockBudgetItem} categoryName="Expense" />
      </SWRConfig>,
    );

    await userEvent.click(screen.getByRole("button", { name: /edit budget item/i }));

    expect(screen.getByLabelText(/name/i)).toHaveValue(mockBudgetItem.name);
    expect(screen.getByLabelText(/planned amount/i)).toHaveValue(
      mockBudgetItem.plannedAmount,
    );
  });

  it("should update budget item on save", async () => {
    const { updateBudgetItem } = await import("@/lib/budgets");
    vi.mocked(updateBudgetItem).mockResolvedValue(undefined);

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <BudgetItemSummary budgetItem={mockBudgetItem} categoryName="Expense" />
      </SWRConfig>,
    );

    await userEvent.click(screen.getByRole("button", { name: /edit budget item/i }));

    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "New Name");
    await userEvent.click(screen.getByRole("button", { name: /save budget item/i }));

    await waitFor(() => {
      expect(updateBudgetItem).toHaveBeenCalledWith(
        `/budgets/${mockBudgetItem.budgetId}/items/${mockBudgetItem.id}`,
        expect.objectContaining({ name: "New Name" }),
      );
      expect(mockMutate).toHaveBeenCalledWith(`/budgets/${mockBudgetItem.budgetId}`);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Budget item updated", {
        variant: "success",
      });
    });
  });

  it("should show validation error on update", async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <BudgetItemSummary budgetItem={mockBudgetItem} categoryName="Expense" />
      </SWRConfig>,
    );

    await userEvent.click(screen.getByRole("button", { name: /edit budget item/i }));

    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.clear(nameInput);
    await userEvent.click(screen.getByRole("button", { name: /save budget item/i }));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
  });

  it("should delete budget item", async () => {
    const { deleteBudgetItem } = await import("@/lib/budgets");
    vi.mocked(deleteBudgetItem).mockResolvedValue(undefined);

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <BudgetItemSummary budgetItem={mockBudgetItem} categoryName="Expense" />
      </SWRConfig>,
    );

    await userEvent.click(screen.getByRole("button", { name: /delete budget item/i }));

    await waitFor(() => {
      expect(deleteBudgetItem).toHaveBeenCalledWith(
        `/budgets/${mockBudgetItem.budgetId}/items/${mockBudgetItem.id}`,
      );
      expect(mockMutate).toHaveBeenCalledWith(`/budgets/${mockBudgetItem.budgetId}`);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Budget item deleted", {
        variant: "success",
      });
    });
  });
});
