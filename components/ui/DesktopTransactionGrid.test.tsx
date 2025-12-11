import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import DesktopTransactionGrid from "./DesktopTransactionGrid";
import { TransactionRow } from "./MobileTransactionList";
import { GridRowModesModel } from "@mui/x-data-grid";

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: vi.fn(
    ({
      rows,
      loading,
      columns,
      slots = {},
      rowModesModel,
      onRowModesModelChange,
      processRowUpdate,
    }) => {
      if (loading) return <div role="progressbar">Loading...</div>;

      const handleEdit = (id: string | number) => {
        const newModel = { ...rowModesModel, [id]: { mode: "edit" } };
        onRowModesModelChange?.(newModel);
      };

      const handleSave = async (id: string | number) => {
        const row = rows.find((r: TransactionRow) => r.id === id);
        if (row && processRowUpdate) {
          await processRowUpdate(row, row);
        }
      };

      return (
        <div data-testid="desktop-transaction-grid">
          {slots?.toolbar && <slots.toolbar />}
          {!rows || rows.length === 0 ? (
            <div data-testid="no-rows">No rows</div>
          ) : (
            <div>
              {rows.map((row: TransactionRow) => {
                const isEditing = rowModesModel?.[row.id]?.mode === "edit";
                return (
                  <div key={row.id} data-testid={`row-${row.id}`}>
                    <span data-testid={`merchant-${row.id}`}>
                      {row.merchant}
                    </span>
                    <span data-testid={`amount-${row.id}`}>{row.amount}</span>
                    <span data-testid={`date-${row.id}`}>{row.date}</span>
                    <span data-testid={`type-${row.id}`}>
                      {row.transactionType}
                    </span>
                    <span data-testid={`notes-${row.id}`}>{row.notes}</span>
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSave(row.id)}
                          aria-label="Save"
                        >
                          Save
                        </button>
                        <button aria-label="Cancel">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(row.id)}
                          aria-label="Edit"
                        >
                          Edit
                        </button>
                        <button aria-label="Delete">Delete</button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    },
  ),
  useGridApiContext: vi.fn(() => ({
    current: { setEditCellValue: vi.fn() },
  })),
  GridRowModes: {
    View: "view",
    Edit: "edit",
  },
  GridRowEditStopReasons: {
    rowFocusOut: "rowFocusOut",
  },
  Toolbar: vi.fn(({ children }) => <div>{children}</div>),
  ToolbarButton: vi.fn(({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  )),
  GridActionsCellItem: vi.fn(({ label, icon, onClick }) => (
    <button onClick={onClick} aria-label={label}>
      {icon}
      {label}
    </button>
  )),
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
];

describe("DesktopTransactionGrid", () => {
  const mockOnRowModesModelChange = vi.fn();
  const mockOnEditClick = vi.fn((id: string | number) => () => {});
  const mockOnSaveClick = vi.fn((id: string | number) => () => {});
  const mockOnCancelClick = vi.fn((id: string | number) => () => {});
  const mockOnDeleteClick = vi.fn((id: string | number) => () => {});
  const mockProcessRowUpdate = vi.fn(
    async (newRow: TransactionRow, oldRow: TransactionRow) => newRow,
  );
  const mockOnAddNew = vi.fn();

  const defaultProps = {
    rows: mockData,
    isLoading: false,
    rowModesModel: {},
    onRowModesModelChange: mockOnRowModesModelChange,
    onEditClick: mockOnEditClick,
    onSaveClick: mockOnSaveClick,
    onCancelClick: mockOnCancelClick,
    onDeleteClick: mockOnDeleteClick,
    processRowUpdate: mockProcessRowUpdate,
    onAddNew: mockOnAddNew,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the grid with transaction data", () => {
    render(<DesktopTransactionGrid {...defaultProps} />);

    expect(screen.getByTestId("desktop-transaction-grid")).toBeInTheDocument();
    expect(screen.getByTestId("merchant-1")).toHaveTextContent("Test Merchant");
    expect(screen.getByTestId("merchant-2")).toHaveTextContent("Test Income");
    expect(screen.getByTestId("amount-1")).toHaveTextContent("100");
    expect(screen.getByTestId("amount-2")).toHaveTextContent("50");
  });

  it("should show loading state", () => {
    render(<DesktopTransactionGrid {...defaultProps} isLoading={true} />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByTestId("row-1")).not.toBeInTheDocument();
  });

  it("should show empty state when no rows", () => {
    render(<DesktopTransactionGrid {...defaultProps} rows={[]} />);

    expect(screen.getByTestId("no-rows")).toBeInTheDocument();
    expect(screen.queryByTestId("row-1")).not.toBeInTheDocument();
  });

  it("should render edit and delete buttons in view mode", () => {
    render(<DesktopTransactionGrid {...defaultProps} />);

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it("should render save and cancel buttons in edit mode", () => {
    const rowModesModel: GridRowModesModel = {
      "1": { mode: "edit" as const },
    };

    render(
      <DesktopTransactionGrid
        {...defaultProps}
        rowModesModel={rowModesModel}
      />,
    );

    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("should switch to edit mode when edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<DesktopTransactionGrid {...defaultProps} />);

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editButtons[0]);

    await waitFor(() => {
      expect(mockOnRowModesModelChange).toHaveBeenCalled();
    });
  });

  it("should call processRowUpdate when save is clicked", async () => {
    const user = userEvent.setup();
    const rowModesModel: GridRowModesModel = {
      "1": { mode: "edit" as const },
    };

    render(
      <DesktopTransactionGrid
        {...defaultProps}
        rowModesModel={rowModesModel}
      />,
    );

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockProcessRowUpdate).toHaveBeenCalledWith(
        mockData[0],
        mockData[0],
      );
    });
  });

  it("should render the add new transaction button", () => {
    render(<DesktopTransactionGrid {...defaultProps} />);

    expect(screen.getByTestId("AddIcon")).toBeInTheDocument();
  });

  it("should call onAddNew when add button is clicked", async () => {
    const user = userEvent.setup();
    render(<DesktopTransactionGrid {...defaultProps} />);

    const addButton = screen.getByTestId("AddIcon").closest("button")!;
    await user.click(addButton);

    expect(mockOnAddNew).toHaveBeenCalled();
  });

  it("should display all transaction fields", () => {
    render(<DesktopTransactionGrid {...defaultProps} />);

    expect(screen.getByTestId("merchant-1")).toHaveTextContent("Test Merchant");
    expect(screen.getByTestId("amount-1")).toHaveTextContent("100");
    expect(screen.getByTestId("type-1")).toHaveTextContent("EXPENSE");
    expect(screen.getByTestId("notes-1")).toHaveTextContent("Test Note");
    expect(screen.getByTestId("date-1")).toBeInTheDocument();
  });

  it("should handle undefined rows", () => {
    render(<DesktopTransactionGrid {...defaultProps} rows={undefined} />);

    expect(screen.getByTestId("desktop-transaction-grid")).toBeInTheDocument();
    expect(screen.queryByTestId("row-1")).not.toBeInTheDocument();
  });

  it("should render multiple rows correctly", () => {
    render(<DesktopTransactionGrid {...defaultProps} />);

    expect(screen.getByTestId("row-1")).toBeInTheDocument();
    expect(screen.getByTestId("row-2")).toBeInTheDocument();
  });

  it("should show different transaction types", () => {
    render(<DesktopTransactionGrid {...defaultProps} />);

    expect(screen.getByTestId("type-1")).toHaveTextContent("EXPENSE");
    expect(screen.getByTestId("type-2")).toHaveTextContent("INCOME");
  });
});
