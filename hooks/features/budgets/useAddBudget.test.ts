import { describe, it, expect, vi, beforeEach, MockedFunction } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAddBudget } from "./useAddBudget";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import dayjs from "dayjs";

vi.mock("notistack", () => ({
  useSnackbar: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("swr/mutation", () => ({
  default: vi.fn(),
}));

const mutate = vi.fn();
vi.mock("swr", async () => {
  const actual = await vi.importActual("swr");
  return {
    ...actual,
    useSWRConfig: () => ({
      mutate,
    }),
  };
});

describe("useAddBudget", () => {
  const enqueueSnackbar = vi.fn();
  const closeSnackbar = vi.fn();
  const push = vi.fn();
  const trigger = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSnackbar as MockedFunction<typeof useSnackbar>).mockReturnValue({
      closeSnackbar,
      enqueueSnackbar,
    });
    (useRouter as MockedFunction<typeof useRouter>).mockReturnValue({
      back(): void {},
      forward(): void {},
      prefetch(): void {},
      refresh(): void {},
      replace(): void {},
      push,
    });
    (useSWRMutation as MockedFunction<typeof useSWRMutation>).mockReturnValue({
      trigger,
      isMutating: false,
      reset: vi.fn(),
      error: undefined,
      data: undefined,
    });
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useAddBudget());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.budgetMonthAndYear).toBeInstanceOf(dayjs);
    expect(result.current.isMutating).toBe(false);
  });

  it("should toggle the modal", () => {
    const { result } = renderHook(() => useAddBudget());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("should close the modal and reset the date", () => {
    const { result } = renderHook(() => useAddBudget());

    act(() => {
      result.current.toggle();
    });

    act(() => {
      result.current.setBudgetMonthAndYear(dayjs("2023-01-01"));
    });

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.budgetMonthAndYear?.format("YYYY-MM-DD")).toBe(
      dayjs().format("YYYY-MM-DD"),
    );
  });

  it("should not save if date is not selected", async () => {
    const { result } = renderHook(() => useAddBudget());

    act(() => {
      result.current.setBudgetMonthAndYear(null);
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(trigger).not.toHaveBeenCalled();
  });

  it("should save budget when date is selected", async () => {
    const { result } = renderHook(() => useAddBudget());
    const testDate = dayjs("2024-06-15");

    act(() => {
      result.current.setBudgetMonthAndYear(testDate);
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(trigger).toHaveBeenCalledWith({
      month: 6,
      year: 2024,
    });
  });

  it("should handle successful budget creation", async () => {
    const mockBudget = { id: "123", month: 6, year: 2024 };
    let onSuccessCallback: ((data: any) => void) | undefined;

    (
      useSWRMutation as MockedFunction<typeof useSWRMutation>
    ).mockImplementation((key, fetcher, options) => {
      onSuccessCallback = options?.onSuccess;
      return {
        trigger: vi.fn().mockResolvedValue(mockBudget),
        isMutating: false,
        reset: vi.fn(),
        error: undefined,
        data: undefined,
      };
    });

    renderHook(() => useAddBudget());

    expect(onSuccessCallback).toBeDefined();

    await act(async () => {
      await onSuccessCallback!(mockBudget);
    });

    expect(mutate).toHaveBeenCalledWith("/budgets");
    expect(enqueueSnackbar).toHaveBeenCalledWith("Budget created", {
      variant: "success",
    });
    expect(push).toHaveBeenCalledWith("/budgets/123");
  });

  it("should handle budget creation error", async () => {
    let onErrorCallback: ((error: Error) => void) | undefined;

    (
      useSWRMutation as MockedFunction<typeof useSWRMutation>
    ).mockImplementation((key, fetcher, options) => {
      onErrorCallback = options?.onError;
      return {
        trigger: vi.fn().mockRejectedValue(new Error("API Error")),
        isMutating: false,
        reset: vi.fn(),
        error: undefined,
        data: undefined,
      };
    });

    renderHook(() => useAddBudget());

    expect(onErrorCallback).toBeDefined();

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    act(() => {
      onErrorCallback!(new Error("API Error"));
    });

    expect(consoleError).toHaveBeenCalledWith(new Error("API Error"));
    expect(enqueueSnackbar).toHaveBeenCalledWith("Failed to create budget", {
      variant: "error",
    });

    consoleError.mockRestore();
  });
});
