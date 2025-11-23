import { act, renderHook } from "@testing-library/react";
import { GridRowModes } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import useSWR from "swr";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTransactions } from "@/hooks/useTransactions";
import * as transactions from "@/lib/transactions";
import { Transaction } from "@/types/api";

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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("useTransactions", () => {
  const enqueueSnackbar = vi.fn();
  const mutate = vi.fn();

  beforeEach(() => {
    (useSWR as vi.Mock).mockReturnValue({
      data: mockTransactions,
      isLoading: false,
      mutate,
    });
    (useSnackbar as vi.Mock).mockReturnValue({ enqueueSnackbar });
    (transactions.createTransaction as vi.Mock).mockResolvedValue({ id: "new-id" });
    (transactions.updateTransaction as vi.Mock).mockResolvedValue({});
    (transactions.deleteTransaction as vi.Mock).mockResolvedValue({});
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
      await result.current.processRowUpdate(newRow, {} as any);
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
      await result.current.processRowUpdate(updatedRow, mockTransactions[0]);
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
    expect(mutate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: expect.stringContaining("new-") }),
      ]),
      false
    );
    expect(Object.values(result.current.rowModesModel)[0]).toEqual({
      mode: GridRowModes.Edit,
      fieldToFocus: "date",
    });
  });
});
