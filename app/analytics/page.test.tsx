"use client";

import { render, screen } from "@testing-library/react";
import Analytics from "./page";
import { useAnalyticsData } from "@/hooks/features/analytics/hooks";
import { vi, describe, it, expect, beforeEach, MockedFunction } from "vitest";
import { useRouter } from "next/navigation";

vi.mock("./components/DatePickers", () => ({
  default: () => <div data-testid="date-pickers" />,
}));
vi.mock("@/components/features/analytics/CashFlowGraph", () => ({
  __esModule: true,
  default: ({ loading }: { loading: boolean }) => (
    <div data-testid="cash-flow-graph">{loading ? "Loading..." : "Loaded"}</div>
  ),
}));
vi.mock("@/components/features/budgets/BudgetItemGraph", () => ({
  __esModule: true,
  default: ({ loading }: { loading: boolean }) => (
    <div data-testid="budget-item-graph">
      {loading ? "Loading..." : "Loaded"}
    </div>
  ),
}));
vi.mock("@/components/features/analytics/CategoryGraph", () => ({
  __esModule: true,
  default: ({ loading }: { loading: boolean }) => (
    <div data-testid="category-graph">{loading ? "Loading..." : "Loaded"}</div>
  ),
}));
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/hooks/features/analytics/hooks", () => ({
  useAnalyticsData: vi.fn(),
}));

describe("Analytics page", () => {
  beforeEach(() => {
    (useAnalyticsData as MockedFunction<typeof useAnalyticsData>).mockClear();
    (useRouter as MockedFunction<typeof useRouter>).mockClear();
  });

  it("should render the loading state", () => {
    (
      useAnalyticsData as MockedFunction<typeof useAnalyticsData>
    ).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    });
    render(<Analytics />);
    expect(screen.getAllByTestId("skeleton")).toHaveLength(4);
  });

  it("should render the success state", () => {
    (
      useAnalyticsData as MockedFunction<typeof useAnalyticsData>
    ).mockReturnValue({
      data: [],
      isLoading: false,
      error: undefined,
    });
    render(<Analytics />);
    expect(screen.getByTestId("date-pickers")).toBeInTheDocument();
    expect(screen.getByTestId("cash-flow-graph")).toHaveTextContent("Loaded");
    expect(screen.getByTestId("budget-item-graph")).toHaveTextContent("Loaded");
    expect(screen.getByTestId("category-graph")).toHaveTextContent("Loaded");
  });

  it("should redirect to the error page when an error occurs", () => {
    const push = vi.fn();
    (useRouter as MockedFunction<typeof useRouter>).mockReturnValue({
      back(): void {},
      forward(): void {},
      prefetch(): void {},
      refresh(): void {},
      replace(): void {},
      push,
    });
    (
      useAnalyticsData as MockedFunction<typeof useAnalyticsData>
    ).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to fetch"),
    });
    render(<Analytics />);
    expect(push).toHaveBeenCalledWith("/error");
  });
});
