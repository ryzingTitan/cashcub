import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCloneBudget } from "./useCloneBudget";
import { cloneBudget } from "@/lib/budgets";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

vi.mock("@/lib/budgets");
vi.mock("notistack");
vi.mock("next/navigation");
vi.mock("swr");

describe("useCloneBudget", () => {
  const mockEnqueueSnackbar = vi.fn();
  const mockPush = vi.fn();
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.mocked(useSnackbar).mockReturnValue({
      enqueueSnackbar: mockEnqueueSnackbar,
    });
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as ReturnType<
      typeof useRouter
    >);
    vi.mocked(useSWRConfig).mockReturnValue({
      mutate: mockMutate,
    } as ReturnType<typeof useSWRConfig>);
  });

  it("should clone a budget successfully", async () => {
    const { result } = renderHook(() => useCloneBudget("1"));
    const clonedBudget = { id: "2" };
    vi.mocked(cloneBudget).mockResolvedValue(clonedBudget);

    await act(async () => {
      await result.current.handleSave();
    });

    expect(cloneBudget).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith("/budgets");
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Budget cloned", {
      variant: "success",
    });
    expect(mockPush).toHaveBeenCalledWith("/budgets/2");
  });

  it("should handle errors when cloning a budget", async () => {
    const { result } = renderHook(() => useCloneBudget("1"));
    vi.mocked(cloneBudget).mockRejectedValue(new Error("Failed to clone"));

    await act(async () => {
      await result.current.handleSave();
    });

    expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Failed to clone budget", {
      variant: "error",
    });
  });
});
