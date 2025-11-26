import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddBudgetItemModal from "./AddBudgetItemModal";
import { SWRConfig } from "swr";
import { SnackbarProvider } from "notistack";
import * as budgets from "@/lib/budgets";

const enqueueSnackbar = vi.fn();

vi.mock("notistack", async (importOriginal) => {
  const actual = await importOriginal<typeof import("notistack")>();
  return {
    ...actual,
    useSnackbar: vi.fn(() => ({
      enqueueSnackbar,
    })),
  };
});

const createBudgetItemSpy = vi.spyOn(budgets, "createBudgetItem");

describe("AddBudgetItemModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the add button and opens the dialog on click", async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <SnackbarProvider>
          <AddBudgetItemModal budgetId="1" categoryId="1" />
        </SnackbarProvider>
      </SWRConfig>,
    );

    const addButton = screen.getByRole("button", { name: /add budget item/i });
    expect(addButton).toBeInTheDocument();

    await userEvent.click(addButton);

    const dialogTitle = await screen.findByText("Add Budget Item");
    expect(dialogTitle).toBeInTheDocument();
  });

  it("closes the dialog when the cancel button is clicked", async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <SnackbarProvider>
          <AddBudgetItemModal budgetId="1" categoryId="1" />
        </SnackbarProvider>
      </SWRConfig>,
    );

    const addButton = screen.getByRole("button", { name: /add budget item/i });
    await userEvent.click(addButton);

    const dialogTitle = await screen.findByText("Add Budget Item");
    expect(dialogTitle).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(dialogTitle).not.toBeInTheDocument();
    });
  });

  it("submits the form with valid data", async () => {
    createBudgetItemSpy.mockResolvedValueOnce({
      id: "1",
      name: "Test Item",
      plannedAmount: 100,
      actualAmount: 0,
      categoryId: "1",
      budgetId: "1",
    });

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <SnackbarProvider>
          <AddBudgetItemModal budgetId="1" categoryId="1" />
        </SnackbarProvider>
      </SWRConfig>,
    );

    const addButton = screen.getByRole("button", { name: /add budget item/i });
    await userEvent.click(addButton);

    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.type(nameInput, "Test Item");

    const plannedAmountInput = screen.getByLabelText(/planned amount/i);
    await userEvent.clear(plannedAmountInput);
    await userEvent.type(plannedAmountInput, "100");

    const saveButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(saveButton);

    expect(createBudgetItemSpy).toHaveBeenCalledWith(
      "/budgets/1/items",
      expect.objectContaining({
        name: "Test Item",
        plannedAmount: 100,
        categoryId: "1",
      }),
    );
  });

  it("shows an error message when submission fails", async () => {
    createBudgetItemSpy.mockRejectedValueOnce(new Error("Failed to create"));

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <SnackbarProvider>
          <AddBudgetItemModal budgetId="1" categoryId="1" />
        </SnackbarProvider>
      </SWRConfig>,
    );

    const addButton = screen.getByRole("button", { name: /add budget item/i });
    await userEvent.click(addButton);

    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.type(nameInput, "Test Item");

    const plannedAmountInput = screen.getByLabelText(/planned amount/i);
    await userEvent.clear(plannedAmountInput);
    await userEvent.type(plannedAmountInput, "100");

    const saveButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        "Failed to create budget item",
        {
          variant: "error",
        },
      );
    });
  });

  it("should show an error message if budgetId is missing", async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <SnackbarProvider>
          <AddBudgetItemModal categoryId="1" />
        </SnackbarProvider>
      </SWRConfig>,
    );

    const addButton = screen.getByRole("button", { name: /add budget item/i });
    await userEvent.click(addButton);

    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.type(nameInput, "Test Item");

    const plannedAmountInput = screen.getByLabelText(/planned amount/i);
    await userEvent.clear(plannedAmountInput);
    await userEvent.type(plannedAmountInput, "100");

    const saveButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        "Budget or category ID is missing",
        {
          variant: "error",
        },
      );
    });
  });
});
