import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AddBudgetModal from "./AddBudgetModal";
import { useAddBudget } from "@/hooks/useAddBudget";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

vi.mock("@/hooks/useAddBudget", () => ({
  useAddBudget: vi.fn(),
}));

describe("AddBudgetModal", () => {
  const toggle = vi.fn();
  const setBudgetMonthAndYear = vi.fn();
  const handleSave = vi.fn();
  const handleClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAddBudget as vi.Mock).mockReturnValue({
      isOpen: false,
      toggle,
      budgetMonthAndYear: dayjs(),
      setBudgetMonthAndYear,
      handleSave,
      handleClose,
    });
  });

  const renderComponent = () =>
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AddBudgetModal />
      </LocalizationProvider>,
    );

  it("should render the add budget button", () => {
    renderComponent();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should open the dialog when the button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button"));
    expect(toggle).toHaveBeenCalled();
  });

  it("should render the dialog when isOpen is true", () => {
    (useAddBudget as vi.Mock).mockReturnValue({
      isOpen: true,
      toggle,
      budgetMonthAndYear: dayjs(),
      setBudgetMonthAndYear,
      handleSave,
      handleClose,
    });
    renderComponent();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should call handleClose when the cancel button is clicked", () => {
    (useAddBudget as vi.Mock).mockReturnValue({
      isOpen: true,
      toggle,
      budgetMonthAndYear: dayjs(),
      setBudgetMonthAndYear,
      handleSave,
      handleClose,
    });
    renderComponent();
    fireEvent.click(screen.getByText("Cancel"));
    expect(handleClose).toHaveBeenCalled();
  });

  it("should call handleSave when the save button is clicked", () => {
    (useAddBudget as vi.Mock).mockReturnValue({
      isOpen: true,
      toggle,
      budgetMonthAndYear: dayjs(),
      setBudgetMonthAndYear,
      handleSave,
      handleClose,
    });
    renderComponent();
    fireEvent.click(screen.getByText("Save"));
    expect(handleSave).toHaveBeenCalled();
  });
});
