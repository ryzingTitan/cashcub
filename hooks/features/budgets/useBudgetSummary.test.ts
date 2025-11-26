import { renderHook } from "@testing-library/react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockedFunction,
  vi,
} from "vitest";
import { useBudgetSummary } from "@/hooks/features/budgets/useBudgetSummary";
import { BudgetSummary } from "@/types/api";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
}));

vi.mock("swr", () => ({
  default: vi.fn(),
}));

const mockBudgetSummary: BudgetSummary = {
  actualExpenses: 0,
  actualIncome: 0,
  budgetItems: [],
  expectedExpenses: 0,
  expectedIncome: 0,
  month: 0,
  year: 0,
  id: "budget1",
};

describe("useBudgetSummary", () => {
  beforeEach(() => {
    (useParams as MockedFunction<typeof useParams>).mockReturnValue({
      slug: "budget1",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return budget data on successful fetch", () => {
    (useSWR as unknown as MockedFunction<typeof useSWR>).mockReturnValue({
      data: mockBudgetSummary,
      isLoading: false,
      error: null,
      mutate: vi.fn(),
      isValidating: false,
    });
    const { result } = renderHook(() => useBudgetSummary());

    expect(result.current.budget).toEqual(mockBudgetSummary);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should return loading state", () => {
    (useSWR as unknown as MockedFunction<typeof useSWR>).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      mutate: vi.fn(),
      isValidating: false,
    });
    const { result } = renderHook(() => useBudgetSummary());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.budget).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should return error state", () => {
    const error = new Error("Failed to fetch");
    (useSWR as unknown as MockedFunction<typeof useSWR>).mockReturnValue({
      data: null,
      isLoading: false,
      error: error,
      mutate: vi.fn(),
      isValidating: false,
    });
    const { result } = renderHook(() => useBudgetSummary());

    expect(result.current.error).toEqual(error);
    expect(result.current.budget).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("should not fetch if slug is not present", () => {
    (useParams as MockedFunction<typeof useParams>).mockReturnValue({});
    (useSWR as unknown as MockedFunction<typeof useSWR>).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      mutate: vi.fn(),
      isValidating: false,
    });
    renderHook(() => useBudgetSummary());
    expect(useSWR).toHaveBeenCalledWith(null, expect.any(Function));
  });
});
