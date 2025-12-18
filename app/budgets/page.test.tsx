import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import { getAllBudgets } from "@/lib/budgets";
import Budgets from "./page";
import { Budget } from "@/types/api";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/budgets", () => ({
  getAllBudgets: vi.fn(),
}));

vi.mock("@/lib/auth0", () => ({
  auth0: {
    getSession: vi.fn(() => Promise.resolve({ user: { sub: "test-user" } })),
  },
  loginUrl: "/api/auth/login",
}));

describe("Budgets page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to most recent budget when multiple budgets exist", async () => {
    const mockBudgets: Budget[] = [
      { id: "1", month: 1, year: 2024 },
      { id: "2", month: 6, year: 2024 },
      { id: "3", month: 12, year: 2023 },
    ];
    vi.mocked(getAllBudgets).mockResolvedValue(mockBudgets);

    await Budgets();

    // Most recent should be id: "2" (June 2024)
    expect(redirect).toHaveBeenCalledWith("/budgets/2");
  });

  it("should correctly identify most recent budget (last in sorted array)", async () => {
    const mockBudgets: Budget[] = [
      { id: "1", month: 3, year: 2024 },
      { id: "2", month: 1, year: 2024 },
      { id: "3", month: 2, year: 2024 },
    ];
    vi.mocked(getAllBudgets).mockResolvedValue(mockBudgets);

    await Budgets();

    // After sorting: [id: "2" (Jan), id: "3" (Feb), id: "1" (Mar)]
    // Most recent should be id: "1" (March 2024)
    expect(redirect).toHaveBeenCalledWith("/budgets/1");
  });

  it("should sort budgets by year first, then by month", async () => {
    const mockBudgets: Budget[] = [
      { id: "1", month: 1, year: 2025 },
      { id: "2", month: 12, year: 2024 },
      { id: "3", month: 6, year: 2024 },
    ];
    vi.mocked(getAllBudgets).mockResolvedValue(mockBudgets);

    await Budgets();

    // After sorting by year and month: 2024-06, 2024-12, 2025-01
    // Most recent should be id: "1" (January 2025)
    expect(redirect).toHaveBeenCalledWith("/budgets/1");
  });

  it("should show empty state when no budgets exist", async () => {
    vi.mocked(getAllBudgets).mockResolvedValue([]);

    const result = await Budgets();

    render(result as React.ReactElement);
    expect(
      screen.getByText("No budgets found. Create your first budget!"),
    ).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should show empty state when budgets is null", async () => {
    vi.mocked(getAllBudgets).mockResolvedValue(null as unknown as Budget[]);

    const result = await Budgets();

    render(result as React.ReactElement);
    expect(
      screen.getByText("No budgets found. Create your first budget!"),
    ).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should redirect to error page on API failure", async () => {
    vi.mocked(getAllBudgets).mockRejectedValue(new Error("API Error"));

    await Budgets();

    expect(redirect).toHaveBeenCalledWith("/error");
  });

  it("should handle single budget correctly", async () => {
    const mockBudgets: Budget[] = [{ id: "1", month: 6, year: 2024 }];
    vi.mocked(getAllBudgets).mockResolvedValue(mockBudgets);

    await Budgets();

    expect(redirect).toHaveBeenCalledWith("/budgets/1");
  });

  it("should handle budgets in different years correctly", async () => {
    const mockBudgets: Budget[] = [
      { id: "1", month: 1, year: 2023 },
      { id: "2", month: 1, year: 2025 },
      { id: "3", month: 1, year: 2024 },
    ];
    vi.mocked(getAllBudgets).mockResolvedValue(mockBudgets);

    await Budgets();

    // Most recent should be 2025
    expect(redirect).toHaveBeenCalledWith("/budgets/2");
  });

  it("should handle budgets in same year with different months correctly", async () => {
    const mockBudgets: Budget[] = [
      { id: "1", month: 3, year: 2024 },
      { id: "2", month: 11, year: 2024 },
      { id: "3", month: 7, year: 2024 },
    ];
    vi.mocked(getAllBudgets).mockResolvedValue(mockBudgets);

    await Budgets();

    // Most recent should be November (month 11)
    expect(redirect).toHaveBeenCalledWith("/budgets/2");
  });
});
