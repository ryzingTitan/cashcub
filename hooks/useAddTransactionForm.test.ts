import { act, renderHook } from "@testing-library/react";
import { FormikProps, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { SWRConfiguration, useSWRConfig } from "swr";
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
    (useSnackbar as MockedFunction<typeof useSnackbar>).mockReturnValue({
      enqueueSnackbar,
      closeSnackbar: vi.fn(),
    });
    (useSWRConfig as MockedFunction<typeof useSWRConfig>).mockReturnValue({
      mutate,
      cache: new Map(),
      fallback: {},
    } as unknown as SWRConfiguration);
    (useParams as MockedFunction<typeof useParams>).mockReturnValue({
      slug: "budget123",
    });
    (useFormik as MockedFunction<typeof useFormik>).mockImplementation(
      (options) => {
        onSubmit = options.onSubmit as unknown as typeof onSubmit;
        return {
          resetForm,
          values: {
            amount: 0,
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
            amount: 0,
            transactionType: "",
            merchant: "",
            notes: "",
            budgetItemId: "",
          },
          initialErrors: {},
          initialTouched: {},
          submitForm: vi.fn(),
        } as unknown as FormikProps<any>;
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
