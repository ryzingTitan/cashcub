import { act, renderHook } from "@testing-library/react";
import { GridRowModes } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import useSWR from "swr";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockedFunction,
  vi,
} from "vitest";
import { useTransactions } from "@/hooks/ui/useTransactions";
import * as transactions from "@/lib/transactions";
import { Transaction } from "@/types/api";
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "@/lib/transactions";

vi.mock("@mui/x-data-grid", () => ({
  GridRowModes: {
    Edit: "edit",
    View: "view",
  },
}));

vi.mock("swr", () => ({
  default: vi.fn(),
}));

vi.mock("notistack", () => ({
  useSnackbar: vi.fn(),
}));

vi.mock("@/lib/transactions", () => ({
  getAllTransactions: vi.fn(),
  createTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  updateTransaction: vi.fn(),
}));

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: new Date().toISOString(),
    amount: 100,
    transactionType: "EXPENSE",
    merchant: "Test Merchant",
    notes: "",
    budgetId: "budget1",
    budgetItemId: "item1",
  },
];

describe("useTransactions", () => {
  const enqueueSnackbar = vi.fn();
  const mutate = vi.fn();

  beforeEach(() => {
    (useSWR as unknown as MockedFunction<typeof useSWR>).mockReturnValue({
      data: mockTransactions,
      isLoading: false,
      mutate,
      error: undefined,
      isValidating: false,
    });
    (useSnackbar as MockedFunction<typeof useSnackbar>).mockReturnValue({
      closeSnackbar: vi.fn(),
      enqueueSnackbar,
    });
    (
      transactions.createTransaction as MockedFunction<typeof createTransaction>
    ).mockResolvedValue({
      amount: 0,
      budgetId: "",
      budgetItemId: "",
      date: "",
      merchant: "",
      notes: "",
      transactionType: "INCOME",
      id: "new-id",
    });
    (
      transactions.updateTransaction as MockedFunction<typeof updateTransaction>
    ).mockResolvedValue({
      amount: 0,
      budgetId: "",
      budgetItemId: "",
      date: "",
      id: "",
      merchant: "",
      notes: "",
      transactionType: "INCOME",
    });
    (
      transactions.deleteTransaction as MockedFunction<typeof deleteTransaction>
    ).mockResolvedValue();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial data", () => {
    const { result } = renderHook(() => useTransactions("budget1", "item1"));
    expect(result.current.rows).toEqual(mockTransactions);
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle edit click", () => {
    const { result } = renderHook(() => useTransactions("budget1", "item1"));
    act(() => {
      result.current.handleEditClick("1")();
    });
    expect(result.current.rowModesModel["1"]).toEqual({
      mode: GridRowModes.Edit,
    });
  });

  it("should handle save click", () => {
    const { result } = renderHook(() => useTransactions("budget1", "item1"));
    act(() => {
      result.current.handleSaveClick("1")();
    });
    expect(result.current.rowModesModel["1"]).toEqual({
      mode: GridRowModes.View,
    });
  });

  it("should handle cancel click on existing row", () => {
    const { result } = renderHook(() => useTransactions("budget1", "item1"));
    act(() => {
      result.current.handleCancelClick("1")();
    });
    expect(result.current.rowModesModel["1"]).toEqual({
      mode: GridRowModes.View,
      ignoreModifications: true,
    });
    expect(mutate).not.toHaveBeenCalled();
  });

  it("should handle successful deletion", async () => {
    const { result } = renderHook(() => useTransactions("budget1", "item1"));
    await act(async () => {
      await result.current.handleDeleteClick("1")();
    });
    expect(mutate).toHaveBeenCalled();
    expect(enqueueSnackbar).toHaveBeenCalledWith("Transaction deleted", {
      variant: "success",
    });
  });

  it("should handle process row update (create)", async () => {
    const { result } = renderHook(() => useTransactions("budget1", "item1"));
    const newRow = { id: "new-123", amount: 200 };
    await act(async () => {
      await result.current.processRowUpdate(newRow);
    });
    expect(transactions.createTransaction).toHaveBeenCalled();
    expect(mutate).toHaveBeenCalled();
    expect(enqueueSnackbar).toHaveBeenCalledWith("Transaction created", {
      variant: "success",
    });
  });

  it("should handle process row update (update)", async () => {
    const { result } = renderHook(() => useTransactions("budget1", "item1"));
    const updatedRow = { ...mockTransactions[0], amount: 150 };
    await act(async () => {
      await result.current.processRowUpdate(updatedRow);
    });
    expect(transactions.updateTransaction).toHaveBeenCalled();
    expect(mutate).toHaveBeenCalled();
    expect(enqueueSnackbar).toHaveBeenCalledWith("Transaction updated", {
      variant: "success",
    });
  });

  it("should handle add new", () => {
    const { result } = renderHook(() => useTransactions("budget1", "item1"));
    act(() => {
      result.current.handleAddNew();
    });

    expect(result.current.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: expect.stringContaining("new-") }),
      ]),
    );
    expect(Object.values(result.current.rowModesModel)[0]).toEqual({
      mode: GridRowModes.Edit,
      fieldToFocus: "date",
    });
  });

  it("should handle deletion error and restore rows", async () => {
    (
      transactions.deleteTransaction as MockedFunction<typeof deleteTransaction>
    ).mockRejectedValue(new Error("Delete failed"));

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useTransactions("budget1", "item1"));
    const originalRowCount = result.current.rows.length;

    await act(async () => {
      await result.current.handleDeleteClick("1")();
    });

    expect(consoleError).toHaveBeenCalled();
    expect(result.current.rows).toHaveLength(originalRowCount);
    expect(enqueueSnackbar).toHaveBeenCalledWith(
      "Failed to delete transaction",
      { variant: "error" },
    );

    consoleError.mockRestore();
  });

  it("should handle delete new row without API call", async () => {
    const { result } = renderHook(() => useTransactions("budget1", "item1"));

    // Add a new row
    act(() => {
      result.current.handleAddNew();
    });

    const newRowId = result.current.rows[0]?.id;

    expect(newRowId).toBeDefined();

    // Delete the new row
    await act(async () => {
      await result.current.handleDeleteClick(newRowId!)();
    });

    expect(transactions.deleteTransaction).not.toHaveBeenCalled();
    expect(result.current.rows).not.toContainEqual(
      expect.objectContaining({ id: newRowId }),
    );
  });

  it("should handle process row update error", async () => {
    (
      transactions.createTransaction as MockedFunction<typeof createTransaction>
    ).mockRejectedValue(new Error("Create failed"));

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useTransactions("budget1", "item1"));
    const newRow = { id: "new-123", amount: 200 };

    await act(async () => {
      try {
        await result.current.processRowUpdate(newRow);
      } catch {
        // Expected to throw
      }
    });

    expect(consoleError).toHaveBeenCalled();
    expect(enqueueSnackbar).toHaveBeenCalledWith("Failed to save transaction", {
      variant: "error",
    });

    consoleError.mockRestore();
  });

  it("should handle cancel click on new row", () => {
    const { result } = renderHook(() => useTransactions("budget1", "item1"));

    // Add a new row
    act(() => {
      result.current.handleAddNew();
    });

    const newRowId = result.current.rows[0]?.id;

    expect(newRowId).toBeDefined();

    // Cancel the new row
    act(() => {
      result.current.handleCancelClick(newRowId!)();
    });

    expect(result.current.rows).not.toContainEqual(
      expect.objectContaining({ id: newRowId }),
    );
  });
});
