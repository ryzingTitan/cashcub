import { act, renderHook } from "@testing-library/react";
import { FormikConfig, FormikProps, useFormik } from "formik";
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
import { useAddTransactionForm } from "@/hooks/ui/useAddTransactionForm";
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

interface TransactionFormValues {
  amount: string;
  transactionType: string;
  merchant: string;
  notes: string;
  budgetItemId: string;
}

describe("useAddTransactionForm", () => {
  const enqueueSnackbar = vi.fn();
  const mutate = vi.fn();
  const resetForm = vi.fn();
  const setSubmitting = vi.fn();

  let onSubmit: (
    values: TransactionFormValues,
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
    } as unknown as ReturnType<typeof useSWRConfig>);
    (useParams as MockedFunction<typeof useParams>).mockReturnValue({
      budgetId: "budget123",
    });
    (useFormik as MockedFunction<typeof useFormik>).mockImplementation(((
      options: FormikConfig<TransactionFormValues>,
    ) => {
      onSubmit = options.onSubmit as unknown as typeof onSubmit;
      return {
        resetForm,
        values: {
          amount: "",
          transactionType: "",
          merchant: "",
          notes: "",
          budgetItemId: "",
        },
        handleSubmit: vi.fn(),
        handleChange: vi.fn(),
        handleBlur: vi.fn(),
        touched: {},
        errors: {},
        isSubmitting: false,
        isValid: true,
        dirty: false,
        setFieldValue: vi.fn(),
        setSubmitting: vi.fn(),
        initialValues: {
          amount: "",
          transactionType: "",
          merchant: "",
          notes: "",
          budgetItemId: "",
        },
        initialErrors: {},
        initialTouched: {},
        submitForm: vi.fn(),
        initialStatus: undefined,
      } as unknown as FormikProps<TransactionFormValues>;
    }) as unknown as typeof useFormik);
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
    const { result } = renderHook(() => useAddTransactionForm());
    const date = dayjs("2023-01-01");

    act(() => {
      result.current.setTransactionDate(date);
    });

    const values = {
      amount: "100",
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
    expect(setSubmitting).toHaveBeenCalledWith(false);
  });

  it("should handle API error on submission", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.spyOn(transactions, "createTransaction").mockRejectedValue(
      new Error("API Error"),
    );
    renderHook(() => useAddTransactionForm());
    const values = {
      amount: "100",
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
    expect(setSubmitting).toHaveBeenCalledWith(false);
    consoleErrorSpy.mockRestore();
  });

  it("should call onSuccess callback after successful submission", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useAddTransactionForm(onSuccess));
    const date = dayjs("2023-01-01");

    act(() => {
      result.current.setTransactionDate(date);
    });

    const values = {
      amount: "100",
      transactionType: "EXPENSE",
      merchant: "Test Merchant",
      notes: "Test Note",
      budgetItemId: "item123",
    };

    await act(async () => {
      await onSubmit(values, { setSubmitting, resetForm });
    });

    expect(onSuccess).toHaveBeenCalled();
  });

  it("should reset transaction date to today after successful submission", async () => {
    const { result } = renderHook(() => useAddTransactionForm());
    const pastDate = dayjs("2023-01-01");

    act(() => {
      result.current.setTransactionDate(pastDate);
    });

    const values = {
      amount: "100",
      transactionType: "EXPENSE",
      merchant: "Test Merchant",
      notes: "Test Note",
      budgetItemId: "item123",
    };

    await act(async () => {
      await onSubmit(values, { setSubmitting, resetForm });
    });

    // Transaction date should be reset to today (approximately)
    const currentDate = result.current.transactionDate;
    expect(currentDate?.format("YYYY-MM-DD")).toBe(
      dayjs().format("YYYY-MM-DD"),
    );
  });

  it("should handle empty merchant and notes by converting to null", async () => {
    const { result } = renderHook(() => useAddTransactionForm());
    const date = dayjs("2023-01-01");

    act(() => {
      result.current.setTransactionDate(date);
    });

    const values = {
      amount: "100",
      transactionType: "EXPENSE",
      merchant: "",
      notes: "  ",
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
        merchant: null,
        notes: null,
      },
    );
  });

  it("should not call onSuccess callback when submission fails", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const onSuccess = vi.fn();
    vi.spyOn(transactions, "createTransaction").mockRejectedValue(
      new Error("API Error"),
    );
    renderHook(() => useAddTransactionForm(onSuccess));

    const values = {
      amount: "100",
      transactionType: "EXPENSE",
      merchant: "Test Merchant",
      notes: "Test Note",
      budgetItemId: "item123",
    };

    await act(async () => {
      await onSubmit(values, { setSubmitting, resetForm });
    });

    expect(onSuccess).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
