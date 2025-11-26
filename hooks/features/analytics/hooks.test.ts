import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAnalyticsData } from "./hooks";
import useSWR from "swr";
import dayjs from "dayjs";

// Mock dependencies
vi.mock("swr");
vi.mock("@/lib/analytics", () => ({
  getAnalyticsData: vi.fn(),
}));

const mockedUseSWR = vi.mocked(useSWR);

describe("useAnalyticsData", () => {
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

    const { result } = renderHook(() => useAnalyticsData(null, null));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it("should return data when fetch is successful", () => {
    const mockData = { totalSpending: 1000 };
    mockedUseSWR.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
      isValidating: false,
    });

    const startDate = dayjs("2023-01-01");
    const endDate = dayjs("2023-01-31");

    const { result } = renderHook(() => useAnalyticsData(startDate, endDate));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeUndefined();
  });

  it("should return error when fetch fails", () => {
    const mockError = new Error("Failed to fetch");
    mockedUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
      mutate: vi.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useAnalyticsData(null, null));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
  });

  it("should call useSWR with correct key when dates are provided", () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
      isValidating: false,
    });

    const startDate = dayjs("2023-01-01");
    const endDate = dayjs("2023-01-31");

    renderHook(() => useAnalyticsData(startDate, endDate));

    expect(mockedUseSWR).toHaveBeenCalledWith(
      ["/analytics", "01-2023", "01-2023"],
      expect.any(Function),
    );
  });

  it("should call useSWR with undefined dates in key when dates are null", () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
      mutate: vi.fn(),
      isValidating: false,
    });

    renderHook(() => useAnalyticsData(null, null));

    expect(mockedUseSWR).toHaveBeenCalledWith(
      ["/analytics", undefined, undefined],
      expect.any(Function),
    );
  });
});
