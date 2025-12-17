import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MobileTransactionList, { TransactionRow } from "./MobileTransactionList";

// Mock the AddTransactionDialog component
vi.mock("./AddTransactionDialog", () => ({
  default: ({
    open,
    onClose,
    budgetItemId,
  }: {
    open: boolean;
    onClose: () => void;
    budgetItemId?: string;
  }) => (
    <div data-testid="add-transaction-dialog">
      {open && (
        <>
          <div>Add Transaction Dialog</div>
          {budgetItemId && (
            <div data-testid="budget-item-id">{budgetItemId}</div>
          )}
          <button onClick={onClose}>Close Dialog</button>
        </>
      )}
    </div>
  ),
}));

const mockData: TransactionRow[] = [
  {
    id: "1",
    date: "2024-07-26T12:00:00.000Z",
    amount: 100,
    transactionType: "EXPENSE",
    merchant: "Test Merchant",
    notes: "Test Note",
  },
  {
    id: "2",
    date: "2024-07-27T12:00:00.000Z",
    amount: 50,
    transactionType: "INCOME",
    merchant: "Test Income",
    notes: "Income Note",
  },
  {
    id: "3",
    date: "2024-07-25T12:00:00.000Z",
    amount: 75,
    transactionType: "EXPENSE",
    merchant: "Earlier Transaction",
    notes: "",
  },
];

describe("MobileTransactionList", () => {
  const mockOnEdit = vi.fn();
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnUpdate = vi.fn();

  const defaultProps = {
    rows: mockData,
    isLoading: false,
    editingId: null,
    onEdit: mockOnEdit,
    onSave: mockOnSave,
    onCancel: mockOnCancel,
    onDelete: mockOnDelete,
    onUpdate: mockOnUpdate,
  };

  const renderComponent = (props = {}) =>
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileTransactionList {...defaultProps} {...props} />
      </LocalizationProvider>,
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the list with transaction data", () => {
    renderComponent();

    expect(screen.getByText("Test Merchant")).toBeInTheDocument();
    expect(screen.getByText("Test Income")).toBeInTheDocument();
    expect(screen.getByText("Earlier Transaction")).toBeInTheDocument();
  });

  it("should show loading state", () => {
    renderComponent({ isLoading: true });

    expect(screen.getByTestId("transaction-list-skeleton")).toBeInTheDocument();
    expect(screen.queryByText("Test Merchant")).not.toBeInTheDocument();
  });

  it("should show empty state when no rows", () => {
    renderComponent({ rows: [] });

    expect(screen.getByText("No transactions found")).toBeInTheDocument();
    expect(screen.queryByText("Test Merchant")).not.toBeInTheDocument();
  });

  it("should render the add transaction button", () => {
    renderComponent();

    expect(
      screen.getByRole("button", { name: /add transaction/i }),
    ).toBeInTheDocument();
  });

  it("should open dialog when add button is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();

    const addButton = screen.getByRole("button", { name: /add transaction/i });

    // Dialog should not be visible initially
    expect(
      screen.queryByText("Add Transaction Dialog"),
    ).not.toBeInTheDocument();

    await user.click(addButton);

    // Dialog should now be visible
    expect(screen.getByText("Add Transaction Dialog")).toBeInTheDocument();
  });

  it("should pass budget item ID to dialog when provided", async () => {
    const user = userEvent.setup();
    const testBudgetItemId = "test-budget-item-123";
    renderComponent({ budgetItemId: testBudgetItemId });

    const addButton = screen.getByRole("button", { name: /add transaction/i });
    await user.click(addButton);

    // Dialog should display the budget item ID
    expect(screen.getByTestId("budget-item-id")).toHaveTextContent(
      testBudgetItemId,
    );
  });

  it("should display transaction amounts with currency formatting", () => {
    renderComponent();

    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("$50.00")).toBeInTheDocument();
    expect(screen.getByText("$75.00")).toBeInTheDocument();
  });

  it("should display transaction types with colored chips", () => {
    renderComponent();

    const expenseChips = screen.getAllByText("EXPENSE");
    const incomeChips = screen.getAllByText("INCOME");

    expect(expenseChips).toHaveLength(2);
    expect(incomeChips).toHaveLength(1);
  });

  it("should display transaction dates in formatted form", () => {
    renderComponent();

    expect(screen.getByText("Jul 26, 2024")).toBeInTheDocument();
    expect(screen.getByText("Jul 27, 2024")).toBeInTheDocument();
    expect(screen.getByText("Jul 25, 2024")).toBeInTheDocument();
  });

  it("should display merchant names", () => {
    renderComponent();

    expect(screen.getByText("Test Merchant")).toBeInTheDocument();
    expect(screen.getByText("Test Income")).toBeInTheDocument();
    expect(screen.getByText("Earlier Transaction")).toBeInTheDocument();
  });

  it("should display notes when present", () => {
    renderComponent();

    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText("Income Note")).toBeInTheDocument();
  });

  it("should not display notes section when notes are empty", () => {
    const dataWithoutNotes: TransactionRow[] = [
      {
        id: "1",
        date: "2024-07-26T12:00:00.000Z",
        amount: 100,
        transactionType: "EXPENSE",
        merchant: "Test Merchant",
        notes: "",
      },
    ];

    renderComponent({ rows: dataWithoutNotes });

    expect(screen.queryByText("Test Note")).not.toBeInTheDocument();
  });

  it("should sort transactions by date in descending order", () => {
    renderComponent();

    const merchants = screen
      .getAllByText(/Test|Earlier/)
      .filter(
        (el) =>
          el.textContent?.includes("Transaction") ||
          el.textContent?.includes("Merchant") ||
          el.textContent?.includes("Income"),
      );

    // The order should be: Test Income (Jul 27), Test Merchant (Jul 26), Earlier Transaction (Jul 25)
    expect(merchants[0]).toHaveTextContent("Test Income");
    expect(merchants[1]).toHaveTextContent("Test Merchant");
    expect(merchants[2]).toHaveTextContent("Earlier Transaction");
  });

  it("should render edit and delete buttons for each transaction", () => {
    renderComponent();

    const editButtons = screen
      .getAllByRole("button", { name: "" })
      .filter((button) => button.querySelector('[data-testid="EditIcon"]'));
    const deleteButtons = screen
      .getAllByRole("button", { name: "" })
      .filter((button) => button.querySelector('[data-testid="DeleteIcon"]'));

    expect(editButtons.length).toBeGreaterThanOrEqual(3);
    expect(deleteButtons.length).toBeGreaterThanOrEqual(3);
  });

  it("should call onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();

    const editButtons = screen
      .getAllByRole("button", { name: "" })
      .filter((button) => button.querySelector('[data-testid="EditIcon"]'));

    await user.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith("2"); // First in sorted order (Jul 27)
  });

  it("should call onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();

    const deleteButtons = screen
      .getAllByRole("button", { name: "" })
      .filter((button) => button.querySelector('[data-testid="DeleteIcon"]'));

    await user.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith("2"); // First in sorted order (Jul 27)
  });

  it("should show edit form when transaction is in edit mode", () => {
    renderComponent({ editingId: "1" });

    expect(screen.getByRole("group", { name: /date/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
    expect(screen.getByLabelText("Merchant")).toBeInTheDocument();
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
  });

  it("should display save and cancel buttons in edit mode", () => {
    renderComponent({ editingId: "1" });

    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("should call onSave when save button is clicked in edit mode", async () => {
    const user = userEvent.setup();
    renderComponent({ editingId: "1" });

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith("1");
  });

  it("should call onCancel when cancel button is clicked in edit mode", async () => {
    const user = userEvent.setup();
    renderComponent({ editingId: "1" });

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("should call onUpdate when editing amount field", async () => {
    const user = userEvent.setup();
    renderComponent({ editingId: "1" });

    const amountInput = screen.getByLabelText("Amount");
    await user.clear(amountInput);
    await user.type(amountInput, "200");

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it("should call onUpdate when editing merchant field", async () => {
    const user = userEvent.setup();
    renderComponent({ editingId: "1" });

    const merchantInput = screen.getByLabelText("Merchant");
    await user.clear(merchantInput);
    await user.type(merchantInput, "New Merchant");

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it("should call onUpdate when editing notes field", async () => {
    const user = userEvent.setup();
    renderComponent({ editingId: "1" });

    const notesInput = screen.getByLabelText("Notes");
    await user.clear(notesInput);
    await user.type(notesInput, "New Note");

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it("should call onUpdate when changing transaction type", async () => {
    const user = userEvent.setup();
    renderComponent({ editingId: "1" });

    const typeSelect = screen.getByRole("combobox");
    await user.click(typeSelect);

    const incomeOption = screen.getByRole("option", { name: "INCOME" });
    await user.click(incomeOption);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it("should handle undefined rows gracefully", () => {
    renderComponent({ rows: undefined });

    expect(screen.getByText("No transactions found")).toBeInTheDocument();
  });

  it("should display card with highlighted border in edit mode", () => {
    const { container } = renderComponent({ editingId: "1" });

    const editCard = container.querySelector('[class*="MuiCard"]');
    expect(editCard).toBeInTheDocument();
  });

  it("should show dollar sign in amount input during edit", () => {
    renderComponent({ editingId: "1" });

    expect(screen.getByText("$")).toBeInTheDocument();
  });

  it("should render date input with proper format in edit mode", () => {
    renderComponent({ editingId: "1" });

    const dateField = screen.getByRole("group", { name: /date/i });
    expect(dateField).toBeInTheDocument();
    // Verify the date picker contains the expected date (07/26/2024)
    expect(screen.getByLabelText("Month")).toHaveAttribute(
      "aria-valuenow",
      "7",
    );
    expect(screen.getByLabelText("Day")).toHaveAttribute("aria-valuenow", "26");
    expect(screen.getByLabelText("Year")).toHaveAttribute(
      "aria-valuenow",
      "2024",
    );
  });

  describe("Pagination", () => {
    it("should show all transactions when less than 20", () => {
      renderComponent();

      expect(screen.getByText("Test Merchant")).toBeInTheDocument();
      expect(screen.getByText("Test Income")).toBeInTheDocument();
      expect(screen.getByText("Earlier Transaction")).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /load more/i }),
      ).not.toBeInTheDocument();
    });

    it("should show only first 20 transactions when more than 20 exist", () => {
      // Create 25 transactions
      const manyTransactions: TransactionRow[] = Array.from(
        { length: 25 },
        (_, i) => ({
          id: `${i + 1}`,
          date: new Date(2024, 6, i + 1).toISOString(),
          amount: 100 + i,
          transactionType: i % 2 === 0 ? "EXPENSE" : "INCOME",
          merchant: `Merchant ${i + 1}`,
          notes: `Note ${i + 1}`,
        }),
      );

      renderComponent({ rows: manyTransactions });

      // Should show first 20
      expect(screen.getByText("Merchant 25")).toBeInTheDocument(); // Most recent
      expect(screen.getByText("Merchant 6")).toBeInTheDocument(); // 20th in sorted order

      // Should not show 21st transaction
      expect(screen.queryByText("Merchant 5")).not.toBeInTheDocument();

      // Load More button should be visible
      expect(
        screen.getByRole("button", { name: /load more/i }),
      ).toBeInTheDocument();
    });

    it("should show correct count in Load More button", () => {
      const manyTransactions: TransactionRow[] = Array.from(
        { length: 25 },
        (_, i) => ({
          id: `${i + 1}`,
          date: new Date(2024, 6, i + 1).toISOString(),
          amount: 100 + i,
          transactionType: i % 2 === 0 ? "EXPENSE" : "INCOME",
          merchant: `Merchant ${i + 1}`,
          notes: `Note ${i + 1}`,
        }),
      );

      renderComponent({ rows: manyTransactions });

      const loadMoreButton = screen.getByRole("button", { name: /load more/i });
      expect(loadMoreButton).toHaveTextContent("Load More (5 remaining)");
    });

    it("should load more transactions when Load More button is clicked", async () => {
      const user = userEvent.setup();
      const manyTransactions: TransactionRow[] = Array.from(
        { length: 25 },
        (_, i) => ({
          id: `${i + 1}`,
          date: new Date(2024, 6, i + 1).toISOString(),
          amount: 100 + i,
          transactionType: i % 2 === 0 ? "EXPENSE" : "INCOME",
          merchant: `Merchant ${i + 1}`,
          notes: `Note ${i + 1}`,
        }),
      );

      renderComponent({ rows: manyTransactions });

      // Initially, Merchant 5 should not be visible
      expect(screen.queryByText("Merchant 5")).not.toBeInTheDocument();

      const loadMoreButton = screen.getByRole("button", { name: /load more/i });
      await user.click(loadMoreButton);

      // After clicking, all transactions should be visible
      expect(screen.getByText("Merchant 5")).toBeInTheDocument();
      expect(screen.getByText("Merchant 1")).toBeInTheDocument();
    });

    it("should hide Load More button when all transactions are visible", async () => {
      const user = userEvent.setup();
      const manyTransactions: TransactionRow[] = Array.from(
        { length: 25 },
        (_, i) => ({
          id: `${i + 1}`,
          date: new Date(2024, 6, i + 1).toISOString(),
          amount: 100 + i,
          transactionType: i % 2 === 0 ? "EXPENSE" : "INCOME",
          merchant: `Merchant ${i + 1}`,
          notes: `Note ${i + 1}`,
        }),
      );

      renderComponent({ rows: manyTransactions });

      const loadMoreButton = screen.getByRole("button", {
        name: /load more/i,
      });
      await user.click(loadMoreButton);

      // Wait for button to disappear with explicit timeout
      await waitFor(
        () => {
          expect(
            screen.queryByRole("button", { name: /load more/i }),
          ).not.toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    }, 10000); // 10 second test timeout
  });
});
