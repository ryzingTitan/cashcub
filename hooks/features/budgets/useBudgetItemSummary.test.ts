import { act, renderHook } from "@testing-library/react";
import { FormikConfig, FormikProps, useFormik } from "formik";
import { useSnackbar } from "notistack";
import { Dispatch, SetStateAction } from "react";
import { useSWRConfig } from "swr";
import { useToggle } from "usehooks-ts";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockedFunction,
  vi,
} from "vitest";
import { useBudgetItemSummary } from "@/hooks/features/budgets/useBudgetItemSummary";
import * as budgets from "@/lib/budgets";
import { BudgetItem } from "@/types/api";

vi.mock("formik", () => ({
  useFormik: vi.fn(),
}));

vi.mock("notistack", () => ({
  useSnackbar: vi.fn(),
}));

vi.mock("swr", () => ({
  useSWRConfig: vi.fn(),
}));

vi.mock("usehooks-ts", () => ({
  useToggle: vi.fn(),
}));

vi.mock("@/lib/budgets", () => ({
  updateBudgetItem: vi.fn(),
  deleteBudgetItem: vi.fn(),
}));

const mockBudgetItem: BudgetItem = {
  id: "item1",
  name: "Groceries",
  plannedAmount: 500,
  actualAmount: 250,
  budgetId: "budget1",
  categoryId: "cat1",
};

interface BudgetItemFormValues {
  name: string;
  plannedAmount: number;
}

describe("useBudgetItemSummary", () => {
  const enqueueSnackbar = vi.fn();
  const mutate = vi.fn();
  const toggle = vi.fn();
  const resetForm = vi.fn();
  const setSubmitting = vi.fn();

  let onSubmit: (
    values: BudgetItemFormValues,
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
      closeSnackbar: vi.fn(),
      enqueueSnackbar,
    });
    (useSWRConfig as MockedFunction<typeof useSWRConfig>).mockReturnValue({
      mutate,
    } as unknown as ReturnType<typeof useSWRConfig>);
    (useToggle as MockedFunction<typeof useToggle>).mockReturnValue([
      false,
      toggle,
      vi.fn() as Dispatch<SetStateAction<boolean>>,
    ]);
    (useFormik as MockedFunction<typeof useFormik>).mockImplementation(((
      options: FormikConfig<BudgetItemFormValues>,
    ) => {
      onSubmit = options.onSubmit as unknown as typeof onSubmit;
      return {
        resetForm,
        values: { name: "", plannedAmount: 0 },
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
        initialValues: { name: "", plannedAmount: 0 },
        initialErrors: {},
        initialTouched: {},
        submitForm: vi.fn(),
        initialStatus: undefined,
      } as unknown as FormikProps<BudgetItemFormValues>;
    }) as unknown as typeof useFormik);
    vi.spyOn(budgets, "updateBudgetItem").mockResolvedValue({
      id: "item1",
      name: "Updated Groceries",
      plannedAmount: 600,
      actualAmount: 250,
      budgetId: "budget1",
      categoryId: "cat1",
    });
    vi.spyOn(budgets, "deleteBudgetItem").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should handle successful form submission (update)", async () => {
    renderHook(() => useBudgetItemSummary(mockBudgetItem));
    const values = { name: "Updated Groceries", plannedAmount: 600 };

    await act(async () => {
      await onSubmit(values, { setSubmitting, resetForm });
    });

    expect(budgets.updateBudgetItem).toHaveBeenCalledWith(
      `/budgets/budget1/items/item1`,
      {
        name: "Updated Groceries",
        plannedAmount: 600,
        categoryId: "cat1",
      },
    );
    expect(mutate).toHaveBeenCalledWith(`/budgets/budget1`);
    expect(enqueueSnackbar).toHaveBeenCalledWith("Budget item updated", {
      variant: "success",
    });
    expect(toggle).toHaveBeenCalled();
    expect(resetForm).toHaveBeenCalled();
  });

  it("should handle API error on update", async () => {
    vi.spyOn(budgets, "updateBudgetItem").mockRejectedValue(
      new Error("API Error"),
    );
    renderHook(() => useBudgetItemSummary(mockBudgetItem));
    const values = { name: "Updated Groceries", plannedAmount: 600 };

    await act(async () => {
      await onSubmit(values, { setSubmitting, resetForm });
    });

    expect(enqueueSnackbar).toHaveBeenCalledWith(
      "Failed to update budget item",
      {
        variant: "error",
      },
    );
  });

  it("should handle successful deletion", async () => {
    const { result } = renderHook(() => useBudgetItemSummary(mockBudgetItem));

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(budgets.deleteBudgetItem).toHaveBeenCalledWith(
      `/budgets/budget1/items/item1`,
    );
    expect(mutate).toHaveBeenCalledWith(`/budgets/budget1`);
    expect(enqueueSnackbar).toHaveBeenCalledWith("Budget item deleted", {
      variant: "success",
    });
  });

  it("should handle API error on deletion", async () => {
    vi.spyOn(budgets, "deleteBudgetItem").mockRejectedValue(
      new Error("API Error"),
    );
    const { result } = renderHook(() => useBudgetItemSummary(mockBudgetItem));

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(enqueueSnackbar).toHaveBeenCalledWith(
      "Failed to delete budget item",
      {
        variant: "error",
      },
    );
  });

  it("should handle cancel", () => {
    const { result } = renderHook(() => useBudgetItemSummary(mockBudgetItem));

    act(() => {
      result.current.handleCancel();
    });

    expect(toggle).toHaveBeenCalled();
    expect(resetForm).toHaveBeenCalled();
  });
});
