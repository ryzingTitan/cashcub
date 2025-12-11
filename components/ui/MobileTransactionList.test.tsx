import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import MobileTransactionList, { TransactionRow } from "./MobileTransactionList";

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
  const mockOnAddNew = vi.fn();

  const defaultProps = {
    rows: mockData,
    isLoading: false,
    editingId: null,
    onEdit: mockOnEdit,
    onSave: mockOnSave,
    onCancel: mockOnCancel,
    onDelete: mockOnDelete,
    onUpdate: mockOnUpdate,
    onAddNew: mockOnAddNew,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the list with transaction data", () => {
    render(<MobileTransactionList {...defaultProps} />);

    expect(screen.getByText("Test Merchant")).toBeInTheDocument();
    expect(screen.getByText("Test Income")).toBeInTheDocument();
    expect(screen.getByText("Earlier Transaction")).toBeInTheDocument();
  });

  it("should show loading state", () => {
    render(<MobileTransactionList {...defaultProps} isLoading={true} />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByText("Test Merchant")).not.toBeInTheDocument();
  });

  it("should show empty state when no rows", () => {
    render(<MobileTransactionList {...defaultProps} rows={[]} />);

    expect(screen.getByText("No transactions found")).toBeInTheDocument();
    expect(screen.queryByText("Test Merchant")).not.toBeInTheDocument();
  });

  it("should render the add transaction button", () => {
    render(<MobileTransactionList {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: /add transaction/i }),
    ).toBeInTheDocument();
  });

  it("should call onAddNew when add button is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileTransactionList {...defaultProps} />);

    const addButton = screen.getByRole("button", { name: /add transaction/i });
    await user.click(addButton);

    expect(mockOnAddNew).toHaveBeenCalled();
  });

  it("should display transaction amounts with currency formatting", () => {
    render(<MobileTransactionList {...defaultProps} />);

    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("$50.00")).toBeInTheDocument();
    expect(screen.getByText("$75.00")).toBeInTheDocument();
  });

  it("should display transaction types with colored chips", () => {
    render(<MobileTransactionList {...defaultProps} />);

    const expenseChips = screen.getAllByText("EXPENSE");
    const incomeChips = screen.getAllByText("INCOME");

    expect(expenseChips).toHaveLength(2);
    expect(incomeChips).toHaveLength(1);
  });

  it("should display transaction dates in formatted form", () => {
    render(<MobileTransactionList {...defaultProps} />);

    expect(screen.getByText("Jul 26, 2024")).toBeInTheDocument();
    expect(screen.getByText("Jul 27, 2024")).toBeInTheDocument();
    expect(screen.getByText("Jul 25, 2024")).toBeInTheDocument();
  });

  it("should display merchant names", () => {
    render(<MobileTransactionList {...defaultProps} />);

    expect(screen.getByText("Test Merchant")).toBeInTheDocument();
    expect(screen.getByText("Test Income")).toBeInTheDocument();
    expect(screen.getByText("Earlier Transaction")).toBeInTheDocument();
  });

  it("should display notes when present", () => {
    render(<MobileTransactionList {...defaultProps} />);

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

    render(<MobileTransactionList {...defaultProps} rows={dataWithoutNotes} />);

    expect(screen.queryByText("Test Note")).not.toBeInTheDocument();
  });

  it("should sort transactions by date in descending order", () => {
    render(<MobileTransactionList {...defaultProps} />);

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
    render(<MobileTransactionList {...defaultProps} />);

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
    render(<MobileTransactionList {...defaultProps} />);

    const editButtons = screen
      .getAllByRole("button", { name: "" })
      .filter((button) => button.querySelector('[data-testid="EditIcon"]'));

    await user.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith("2"); // First in sorted order (Jul 27)
  });

  it("should call onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileTransactionList {...defaultProps} />);

    const deleteButtons = screen
      .getAllByRole("button", { name: "" })
      .filter((button) => button.querySelector('[data-testid="DeleteIcon"]'));

    await user.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith("2"); // First in sorted order (Jul 27)
  });

  it("should show edit form when transaction is in edit mode", () => {
    render(<MobileTransactionList {...defaultProps} editingId="1" />);

    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
    expect(screen.getByLabelText("Merchant")).toBeInTheDocument();
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
  });

  it("should display save and cancel buttons in edit mode", () => {
    render(<MobileTransactionList {...defaultProps} editingId="1" />);

    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("should call onSave when save button is clicked in edit mode", async () => {
    const user = userEvent.setup();
    render(<MobileTransactionList {...defaultProps} editingId="1" />);

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith("1");
  });

  it("should call onCancel when cancel button is clicked in edit mode", async () => {
    const user = userEvent.setup();
    render(<MobileTransactionList {...defaultProps} editingId="1" />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("should call onUpdate when editing amount field", async () => {
    const user = userEvent.setup();
    render(<MobileTransactionList {...defaultProps} editingId="1" />);

    const amountInput = screen.getByLabelText("Amount");
    await user.clear(amountInput);
    await user.type(amountInput, "200");

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it("should call onUpdate when editing merchant field", async () => {
    const user = userEvent.setup();
    render(<MobileTransactionList {...defaultProps} editingId="1" />);

    const merchantInput = screen.getByLabelText("Merchant");
    await user.clear(merchantInput);
    await user.type(merchantInput, "New Merchant");

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it("should call onUpdate when editing notes field", async () => {
    const user = userEvent.setup();
    render(<MobileTransactionList {...defaultProps} editingId="1" />);

    const notesInput = screen.getByLabelText("Notes");
    await user.clear(notesInput);
    await user.type(notesInput, "New Note");

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it("should call onUpdate when changing transaction type", async () => {
    const user = userEvent.setup();
    render(<MobileTransactionList {...defaultProps} editingId="1" />);

    const typeSelect = screen.getByRole("combobox");
    await user.click(typeSelect);

    const incomeOption = screen.getByRole("option", { name: "INCOME" });
    await user.click(incomeOption);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it("should handle undefined rows gracefully", () => {
    render(<MobileTransactionList {...defaultProps} rows={undefined} />);

    expect(screen.getByText("No transactions found")).toBeInTheDocument();
  });

  it("should display card with highlighted border in edit mode", () => {
    const { container } = render(
      <MobileTransactionList {...defaultProps} editingId="1" />,
    );

    const editCard = container.querySelector('[class*="MuiCard"]');
    expect(editCard).toBeInTheDocument();
  });

  it("should show dollar sign in amount input during edit", () => {
    render(<MobileTransactionList {...defaultProps} editingId="1" />);

    expect(screen.getByText("$")).toBeInTheDocument();
  });

  it("should render date input with proper format in edit mode", () => {
    render(<MobileTransactionList {...defaultProps} editingId="1" />);

    const dateInput = screen.getByLabelText("Date") as HTMLInputElement;
    expect(dateInput.value).toBe("2024-07-26");
  });
});
