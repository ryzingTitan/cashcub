import { renderHook } from "@testing-library/react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { BudgetSummary } from "@/types/api";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
}));

vi.mock("swr", () => ({
  default: vi.fn(),
}));

const mockBudgetSummary: BudgetSummary = {
  id: "budget1",
  name: "Test Budget",
  startDate: "2023-01-01",
  endDate: "2023-01-31",
  totalPlannedAmount: 1000,
  totalActualAmount: 500,
  categories: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: "user1",
  budgetItem: [],
};

describe("useBudgetSummary", () => {
  beforeEach(() => {
    (useParams as vi.Mock).mockReturnValue({ slug: "budget1" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return budget data on successful fetch", () => {
    (useSWR as vi.Mock).mockReturnValue({
      data: mockBudgetSummary,
      isLoading: false,
      error: null,
    });
    const { result } = renderHook(() => useBudgetSummary());

    expect(result.current.budget).toEqual(mockBudgetSummary);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should return loading state", () => {
    (useSWR as vi.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });
    const { result } = renderHook(() => useBudgetSummary());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.budget).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should return error state", () => {
    const error = new Error("Failed to fetch");
    (useSWR as vi.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: error,
    });
    const { result } = renderHook(() => useBudgetSummary());

    expect(result.current.error).toEqual(error);
    expect(result.current.budget).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("should not fetch if slug is not present", () => {
    (useParams as vi.Mock).mockReturnValue({});
    (useSWR as vi.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    renderHook(() => useBudgetSummary());
    expect(useSWR).toHaveBeenCalledWith(null, expect.any(Function));
  });
});
