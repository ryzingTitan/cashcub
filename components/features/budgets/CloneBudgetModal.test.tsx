import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import CloneBudgetModal from "./CloneBudgetModal";
import { useCloneBudget } from "@/hooks/features/budgets/useCloneBudget";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

vi.mock("@/hooks/features/budgets/useCloneBudget");

describe("CloneBudgetModal", () => {
  const mockToggleModal = vi.fn();
  const mockSetBudgetMonthAndYear = vi.fn();
  const mockHandleSave = vi.fn();
  const mockHandleClose = vi.fn();

  it("renders the clone button and opens the modal on click", async () => {
    (useCloneBudget as Mock).mockReturnValue({
      isModalOpen: false,
      toggleModal: mockToggleModal,
      budgetMonthAndYear: dayjs(),
      setBudgetMonthAndYear: mockSetBudgetMonthAndYear,
      handleSave: mockHandleSave,
      handleClose: mockHandleClose,
    });

    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CloneBudgetModal budgetId="1" />
      </LocalizationProvider>,
    );

    const cloneButton = screen.getByRole("button", { name: /clone budget/i });
    expect(cloneButton).toBeInTheDocument();

    await userEvent.click(cloneButton);
    expect(mockToggleModal).toHaveBeenCalledTimes(1);
  });

  it("displays the modal with content when open", () => {
    (useCloneBudget as Mock).mockReturnValue({
      isModalOpen: true,
      toggleModal: mockToggleModal,
      budgetMonthAndYear: dayjs(),
      setBudgetMonthAndYear: mockSetBudgetMonthAndYear,
      handleSave: mockHandleSave,
      handleClose: mockHandleClose,
    });

    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CloneBudgetModal budgetId="1" />
      </LocalizationProvider>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Clone Budget")).toBeInTheDocument();
    // MUI DatePicker can render multiple elements with the same label
    const newBudgetInputs = screen.getAllByLabelText("New Budget");
    expect(newBudgetInputs[0]).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });
});
