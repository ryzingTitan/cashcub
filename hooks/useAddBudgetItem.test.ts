import { act, renderHook } from "@testing-library/react";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
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
import { useAddBudgetItem } from "@/hooks/useAddBudgetItem";
import * as budgets from "@/lib/budgets";

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
  createBudgetItem: vi.fn(),
}));

describe("useAddBudgetItem", () => {
  const enqueueSnackbar = vi.fn();
  const mutate = vi.fn();
  const toggle = vi.fn();
  const resetForm = vi.fn();
  const setSubmitting = vi.fn();

  let onSubmit: (
    values: { name: string; plannedAmount: number },
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
    });
    (useToggle as MockedFunction<typeof useToggle>).mockReturnValue([
      false,
      toggle,
    ]);
    (useFormik as MockedFunction<typeof useFormik>).mockImplementation(
      (options) => {
        onSubmit = options.onSubmit;
        return {
          resetForm,
        };
      },
    );
    vi.spyOn(budgets, "createBudgetItem").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should handle successful form submission", async () => {
    renderHook(() =>
      useAddBudgetItem({ budgetId: "budget1", categoryId: "cat1" }),
    );
    const values = { name: "Test Item", plannedAmount: 100 };

    await act(async () => {
      await onSubmit(values, { setSubmitting, resetForm });
    });

    expect(budgets.createBudgetItem).toHaveBeenCalledWith(
      "/budgets/budget1/items",
      {
        name: "Test Item",
        plannedAmount: 100,
        categoryId: "cat1",
      },
    );
    expect(mutate).toHaveBeenCalledWith("/budgets/budget1");
    expect(enqueueSnackbar).toHaveBeenCalledWith("Budget item created", {
      variant: "success",
    });
    expect(toggle).toHaveBeenCalled();
    expect(resetForm).toHaveBeenCalled();
  });

  it("should show error if budgetId or categoryId is missing", async () => {
    renderHook(() => useAddBudgetItem({}));
    const values = { name: "Test Item", plannedAmount: 100 };

    await act(async () => {
      await onSubmit(values, { setSubmitting, resetForm });
    });

    expect(enqueueSnackbar).toHaveBeenCalledWith(
      "Budget or category ID is missing",
      {
        variant: "error",
      },
    );
    expect(budgets.createBudgetItem).not.toHaveBeenCalled();
  });

  it("should handle API error on submission", async () => {
    vi.spyOn(budgets, "createBudgetItem").mockRejectedValue(
      new Error("API Error"),
    );
    renderHook(() =>
      useAddBudgetItem({ budgetId: "budget1", categoryId: "cat1" }),
    );
    const values = { name: "Test Item", plannedAmount: 100 };

    await act(async () => {
      await onSubmit(values, { setSubmitting, resetForm });
    });

    expect(enqueueSnackbar).toHaveBeenCalledWith(
      "Failed to create budget item",
      {
        variant: "error",
      },
    );
  });

  it("should handle close", () => {
    const { result } = renderHook(() => useAddBudgetItem({}));

    act(() => {
      result.current.handleClose();
    });

    expect(toggle).toHaveBeenCalled();
    expect(resetForm).toHaveBeenCalled();
  });
});
