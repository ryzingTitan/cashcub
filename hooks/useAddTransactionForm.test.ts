import { act, renderHook } from "@testing-library/react";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useSWRConfig } from "swr";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockedFunction,
  vi,
} from "vitest";
import { useAddTransactionForm } from "@/hooks/useAddTransactionForm";
import * as transactions from "@/lib/transactions";
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
    (useSnackbar as MockedFunction<typeof useSnackbar>).mockReturnValue({
      enqueueSnackbar,
      closeSnackbar: vi.fn(),
    });
    (useSWRConfig as MockedFunction<typeof useSWRConfig>).mockReturnValue({
      mutate,
    } as ReturnType<typeof useSWRConfig>);
    (useFormik as MockedFunction<typeof useFormik>).mockImplementation(
      (options) => {
        onSubmit = options.onSubmit as unknown as typeof onSubmit;
        return {
          resetForm,
        } as ReturnType<typeof useFormik>;
      },
    );
    vi.spyOn(transactions, "createTransaction").mockResolvedValue({
      id: "1",
      amount: 100,
      transactionType: "EXPENSE",
      merchant: "Test Merchant",
      notes: "Test Note",
      budgetItemId: "item123",
      budgetId: "budget123",
      date: "2023-01-01T00:00:00.000Z",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should handle successful form submission", async () => {
    const { result } = renderHook(() =>
      useAddTransactionForm({ slug: "budget123" }),
    );
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
    renderHook(() => useAddTransactionForm({ slug: "budget123" }));
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
