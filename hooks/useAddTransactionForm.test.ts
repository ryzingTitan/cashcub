import { act, renderHook } from "@testing-library/react";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useSWRConfig } from "swr";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAddTransactionForm } from "@/hooks/useAddTransactionForm";
import * as transactions from "@/lib/transactions";
import { useParams } from "next/navigation";
import dayjs from "dayjs";

vi.mock("formik", () => ({
  useFormik: vi.fn(),
}));

vi.mock("notistack", () => ({
  useSnackbar: vi.fn(),
}));

vi.mock("swr", () => ({
  useSWRConfig: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
}));

vi.mock("@/lib/transactions", () => ({
  createTransaction: vi.fn(),
}));

describe("useAddTransactionForm", () => {
  const enqueueSnackbar = vi.fn();
  const mutate = vi.fn();
  const resetForm = vi.fn();
  const setSubmitting = vi.fn();

  let onSubmit: (
    values: {
      amount: number;
      transactionType: string;
      merchant: string;
      notes: string;
      budgetItemId: string;
    },
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: () => void;
    },
  ) => Promise<void>;

  beforeEach(() => {
    (useSnackbar as vi.Mock).mockReturnValue({ enqueueSnackbar });
    (useSWRConfig as vi.Mock).mockReturnValue({ mutate });
    (useParams as vi.Mock).mockReturnValue({ slug: "budget123" });
    (useFormik as vi.Mock).mockImplementation((options) => {
      onSubmit = options.onSubmit;
      return {
        resetForm,
      };
    });
    vi.spyOn(transactions, "createTransaction").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should handle successful form submission", async () => {
    const { result } = renderHook(() => useAddTransactionForm());
    const date = dayjs("2023-01-01");

    act(() => {
      result.current.setTransactionDate(date);
    });

    const values = {
      amount: 100,
      transactionType: "EXPENSE",
      merchant: "Test Merchant",
      notes: "Test Note",
      budgetItemId: "item123",
    };

    await act(async () => {
      await onSubmit(values, { setSubmitting, resetForm });
    });

    expect(transactions.createTransaction).toHaveBeenCalledWith(
      `/budgets/budget123/items/item123/transactions`,
      {
        date: date.toISOString(),
        amount: 100,
        transactionType: "EXPENSE",
        merchant: "Test Merchant",
        notes: "Test Note",
      },
    );
    expect(mutate).toHaveBeenCalledWith(
      `/budgets/budget123/items/item123/transactions`,
    );
    expect(enqueueSnackbar).toHaveBeenCalledWith("Transaction created", {
      variant: "success",
    });
    expect(resetForm).toHaveBeenCalled();
  });

  it("should handle API error on submission", async () => {
    vi.spyOn(transactions, "createTransaction").mockRejectedValue(
      new Error("API Error"),
    );
    renderHook(() => useAddTransactionForm());
    const values = {
      amount: 100,
      transactionType: "EXPENSE",
      merchant: "Test Merchant",
      notes: "Test Note",
      budgetItemId: "item123",
    };

    await act(async () => {
      await onSubmit(values, { setSubmitting, resetForm });
    });

    expect(enqueueSnackbar).toHaveBeenCalledWith(
      "Failed to create transaction",
      {
        variant: "error",
      },
    );
  });
});
