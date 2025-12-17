import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCloneBudget } from "./useCloneBudget";
import { cloneBudget } from "@/lib/budgets";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

vi.mock("@/lib/budgets");
vi.mock("notistack");
vi.mock("next/navigation");
vi.mock("swr");
vi.mock("swr/mutation");

describe("useCloneBudget", () => {
  const mockEnqueueSnackbar = vi.fn();
  const mockPush = vi.fn();
  const mockMutate = vi.fn();
  const mockTrigger = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(useSnackbar).mockReturnValue({
      closeSnackbar: vi.fn(),
      enqueueSnackbar: mockEnqueueSnackbar,
    });
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as unknown as ReturnType<typeof useRouter>);
    vi.mocked(useSWRConfig).mockReturnValue({
      mutate: mockMutate,
    } as unknown as ReturnType<typeof useSWRConfig>);
  });

  it("should clone a budget successfully", async () => {
    const clonedBudget = { id: "2", month: 10, year: 2023 };
    
    // Mock useSWRMutation to call the onSuccess callback
    vi.mocked(useSWRMutation).mockImplementation((key, fetcher, options) => {
      const trigger = async (arg: any) => {
        const result = await fetcher(key as string, { arg });
        if (options?.onSuccess) {
          await options.onSuccess(result, key as string, { arg });
        }
        return result;
      };
      
      return {
        trigger: mockTrigger.mockImplementation(trigger),
        isMutating: false,
        error: undefined,
        data: undefined,
        reset: vi.fn(),
      };
    });
    
    vi.mocked(cloneBudget).mockResolvedValue(clonedBudget);

    const { result } = renderHook(() => useCloneBudget("1"));

    await act(async () => {
      await result.current.handleSave();
    });

    expect(mockTrigger).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith("/budgets");
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Budget cloned", {
      variant: "success",
    });
    expect(mockPush).toHaveBeenCalledWith("/budgets/2");
  });

  it("should handle errors when cloning a budget", async () => {
    const error = new Error("Failed to clone");
    
    // Mock useSWRMutation to call the onError callback
    vi.mocked(useSWRMutation).mockImplementation((key, fetcher, options) => {
      const trigger = async (arg: any) => {
        try {
          await fetcher(key as string, { arg });
        } catch (err) {
          if (options?.onError) {
            options.onError(err as Error, key as string, { arg });
          }
          throw err;
        }
      };
      
      return {
        trigger: mockTrigger.mockImplementation(trigger),
        isMutating: false,
        error: undefined,
        data: undefined,
        reset: vi.fn(),
      };
    });
    
    vi.mocked(cloneBudget).mockRejectedValue(error);

    const { result } = renderHook(() => useCloneBudget("1"));

    await act(async () => {
      try {
        await result.current.handleSave();
      } catch (err) {
        // Expected to throw
      }
    });

    expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Failed to clone budget", {
      variant: "error",
    });
  });
});
