import { describe, it, expect, vi, beforeEach } from "vitest";
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
  const push = vi.fn();
  const trigger = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSnackbar as vi.Mock).mockReturnValue({ enqueueSnackbar });
    (useRouter as vi.Mock).mockReturnValue({ push });
    (useSWRMutation as vi.Mock).mockReturnValue({
      trigger,
      isMutating: false,
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
});
