import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useBudgetList } from "./useBudgetList";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { Budget } from "@/types/api";

// Mock dependencies
vi.mock("swr");
vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
  useRouter: vi.fn(),
}));

const mockedUseSWR = vi.mocked(useSWR);
const mockedUseParams = vi.mocked(useParams);
const mockedUseRouter = vi.mocked(useRouter);

const mockPush = vi.fn();

const mockBudgets: Budget[] = [
  { id: "2", year: 2024, month: 2 },
  { id: "1", year: 2024, month: 1 },
  { id: "3", year: 2023, month: 12 },
];

describe("useBudgetList", () => {
  beforeEach(() => {
    mockedUseRouter.mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return loading state", () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
      mutate: vi.fn(),
      isValidating: false,
    });
    mockedUseParams.mockReturnValue({ budgetId: "" });

    const { result } = renderHook(() => useBudgetList());

    expect(result.current.isLoading).toBe(true);
  });

  it("should redirect to /error on fetch error", () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to fetch"),
      mutate: vi.fn(),
      isValidating: false,
    });
    mockedUseParams.mockReturnValue({ budgetId: "" });

    renderHook(() => useBudgetList());

    expect(mockPush).toHaveBeenCalledWith("/error");
  });

  it("should return sorted budgets and correct selected budget", () => {
    mockedUseSWR.mockReturnValue({
      data: mockBudgets,
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
      isValidating: false,
    });
    mockedUseParams.mockReturnValue({ budgetId: "1" });

    const { result } = renderHook(() => useBudgetList());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.budgets[0].month).toBe(12); // 2023, 12
    expect(result.current.budgets[1].month).toBe(1); // 2024, 1
    expect(result.current.budgets[2].month).toBe(2); // 2024, 2
    expect(result.current.selectedBudget?.id).toBe("1");
  });

  it("should return null for selected budget if slug does not match", () => {
    mockedUseSWR.mockReturnValue({
      data: mockBudgets,
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
      isValidating: false,
    });
    mockedUseParams.mockReturnValue({ budgetId: "non-existent-slug" });

    const { result } = renderHook(() => useBudgetList());

    expect(result.current.selectedBudget).toBeNull();
  });

  it("should handle budget selection change and navigate", () => {
    mockedUseSWR.mockReturnValue({
      data: mockBudgets,
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
      isValidating: false,
    });
    mockedUseParams.mockReturnValue({ budgetId: "" });

    const { result } = renderHook(() => useBudgetList());

    const newSelectedBudget = mockBudgets[0];
    result.current.handleBudgetChange(null, newSelectedBudget);

    expect(mockPush).toHaveBeenCalledWith(`/budgets/${newSelectedBudget.id}`);
  });

  it("should handle budget deselection and navigate to budgets overview", () => {
    mockedUseSWR.mockReturnValue({
      data: mockBudgets,
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
      isValidating: false,
    });
    mockedUseParams.mockReturnValue({ budgetId: "1" });

    const { result } = renderHook(() => useBudgetList());

    result.current.handleBudgetChange(null, null);

    expect(mockPush).toHaveBeenCalledWith("/budgets");
  });

  it("should format the option label correctly", () => {
    mockedUseSWR.mockReturnValue({
      data: [],
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
      isValidating: false,
    });
    mockedUseParams.mockReturnValue({ budgetId: "" });

    const { result } = renderHook(() => useBudgetList());
    const budget = {
      year: 2024,
      month: 1,
      id: "1",
      created_at: "",
      updated_at: "",
    };

    expect(result.current.getOptionLabel(budget)).toBe("January 2024");
  });
});
