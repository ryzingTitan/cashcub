import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, MockedFunction } from "vitest";
import Transactions from "./Transactions";
import { SWRConfig } from "swr";
import { useSnackbar } from "notistack";
import { Transaction } from "@/types/api";
import { useState } from "react";
import userEvent from "@testing-library/user-event";
import { useToggle } from "usehooks-ts";
import * as transactionsApi from "@/lib/transactions";
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
} from "@/lib/transactions";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/",
}));

vi.mock("notistack");
vi.mock("usehooks-ts");
vi.mock("@/lib/transactions");

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: vi.fn(({ rows, loading, columns, slots = {}, slotProps = {} }) => {
    if (loading) return <div role="progressbar">Loading...</div>;
    return (
      <div>
        {slots.toolbar && <slots.toolbar {...(slotProps.toolbar || {})} />}
        {!rows || rows.length === 0 ? (
          <div data-testid="mock-datagrid">No rows</div>
        ) : (
          <div data-testid="mock-datagrid">
            {rows.map((row: Transaction) => (
              <div key={row.id}>
                <span>{row.merchant}</span>
                <div>
                  {columns
                    .find((c) => c.field === "actions")
                    .getActions({ id: row.id })
                    .map((action) => (
                      <div key={action.props.label}>{action}</div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }),
  GridActionsCellItem: vi.fn(({ label, icon, onClick }) => (
    <button onClick={onClick}>
      {icon}
      {label}
    </button>
  )),
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
}));

const mockEnqueueSnackbar = vi.fn();

const mockData: Transaction[] = [
  {
    id: "1",
    budgetId: "1",
    budgetItemId: "1",
    date: "2024-07-26T12:00:00.000Z",
    amount: 100,
    transactionType: "EXPENSE",
    merchant: "Test Merchant",
    notes: "Test Note",
  },
];

describe("Transactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSnackbar as MockedFunction<typeof useSnackbar>).mockReturnValue({
      closeSnackbar: vi.fn(),
      enqueueSnackbar: mockEnqueueSnackbar,
    });
    (useToggle as MockedFunction<typeof useToggle>).mockImplementation(
      (initialValue: boolean) => {
        const [value, setValue] = useState(initialValue);
        const toggle = () => setValue(!value);
        return [value, toggle];
      },
    );
  });

  const renderComponent = () => {
    const user = userEvent.setup();
    const renderResult = render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <Transactions budgetId="1" budgetItemId="1" />
      </SWRConfig>,
    );
    return { user, ...renderResult };
  };

  it("should render the component and open the dialog", async () => {
    (
      transactionsApi.getAllTransactions as MockedFunction<
        typeof getAllTransactions
      >
    ).mockResolvedValue([]);
    const { user } = renderComponent();
    const button = screen.getByRole("button", { name: /view transactions/i });
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByText("Transactions")).toBeInTheDocument();
    });
  });

  it("should display transactions in the grid", async () => {
    (
      transactionsApi.getAllTransactions as MockedFunction<
        typeof getAllTransactions
      >
    ).mockResolvedValue(mockData);
    const { user } = renderComponent();
    const button = screen.getByRole("button", { name: /view transactions/i });
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByText("Test Merchant")).toBeInTheDocument();
    });
  });

  it("should show loading state", async () => {
    (
      transactionsApi.getAllTransactions as MockedFunction<
        typeof getAllTransactions
      >
    ).mockReturnValue(new Promise(() => {}));
    const { user } = renderComponent();
    const button = screen.getByRole("button", { name: /view transactions/i });
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  it("should add a new transaction", async () => {
    (
      transactionsApi.getAllTransactions as MockedFunction<
        typeof getAllTransactions
      >
    ).mockResolvedValue([]);
    (
      transactionsApi.createTransaction as MockedFunction<
        typeof createTransaction
      >
    ).mockResolvedValue({
      amount: 0,
      budgetId: "1",
      budgetItemId: "2",
      date: "",
      notes: "",
      transactionType: "EXPENSE",
      id: "2",
      merchant: "New Merchant",
    });
    const { user } = renderComponent();
    const button = screen.getByRole("button", { name: /view transactions/i });
    await user.click(button);

    const addButton = screen.getByTestId("AddIcon");
    await user.click(addButton.closest("button")!);

    await waitFor(() => {
      expect(screen.getByText("Save")).toBeInTheDocument();
    });
  });

  it("should delete a transaction", async () => {
    (
      transactionsApi.getAllTransactions as MockedFunction<
        typeof getAllTransactions
      >
    ).mockResolvedValue(mockData);
    (
      transactionsApi.deleteTransaction as MockedFunction<
        typeof deleteTransaction
      >
    ).mockResolvedValue(undefined);
    const { user } = renderComponent();
    const button = screen.getByRole("button", { name: /view transactions/i });
    await user.click(button);
    await waitFor(async () => {
      const deleteButton = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteButton);
    });
    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        "Transaction deleted",
        expect.any(Object),
      );
    });
  });
});
