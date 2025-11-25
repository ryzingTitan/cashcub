import { describe, it, vi, expect, beforeEach } from "vitest";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import AddTransactionModal from "./AddTransactionModal";
import { useAddTransactionForm } from "@/hooks/useAddTransactionForm";
import { FormikProps } from "formik";
import { BudgetItem } from "@/types/api";
import userEvent from "@testing-library/user-event";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

vi.mock("@/hooks/useAddTransactionForm");

const mockBudgetItems: BudgetItem[] = [
  {
    id: "b4f1b7f1-7b1g-4b1f-8b1f-1b7f1b7f1b7f",
    name: "Groceries",
    plannedAmount: 100,
    actualAmount: 0,
    budgetId: "budget-id",
    categoryId: "category-id",
  },
  {
    id: "a3e0a6e0-6a0e-4a0e-8a0e-0a6e0a6e0a6e",
    name: "Gas",
    plannedAmount: 50,
    actualAmount: 0,
    budgetId: "budget-id",
    categoryId: "category-id",
  },
];

const mockFormik = {
  values: {
    budgetItemId: "",
    transactionType: "",
    amount: 0,
    merchant: "",
    notes: "",
  },
  errors: {},
  touched: {},
  isValid: true,
  handleChange: vi.fn(),
  handleBlur: vi.fn(),
  handleSubmit: vi.fn(),
  submitForm: vi.fn(),
  resetForm: vi.fn(),
} as unknown as FormikProps<{
  budgetItemId: string;
  transactionType: string;
  amount: number;
  merchant: string;
  notes: string;
}>;

describe("AddTransactionModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (
      useAddTransactionForm as MockedFunction<typeof useAddTransactionForm>
    ).mockReturnValue({
      formik: mockFormik,
      transactionDate: null,
      setTransactionDate: vi.fn(),
    });
  });

  it("should render the add transaction button", () => {
    render(
      <AddTransactionModal slug="test-slug" budgetItems={mockBudgetItems} />,
    );

    expect(
      screen.getByRole("button", { name: /Add Transaction/i }),
    ).toBeInTheDocument();
  });

  it("should open the modal when the add transaction button is clicked", async () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AddTransactionModal slug="test-slug" budgetItems={mockBudgetItems} />
      </LocalizationProvider>,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Add Transaction/i }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should close the modal when the cancel button is clicked", async () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AddTransactionModal slug="test-slug" budgetItems={mockBudgetItems} />
      </LocalizationProvider>,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Add Transaction/i }),
    );

    const dialog = screen.getByRole("dialog");

    await userEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    await waitForElementToBeRemoved(dialog);
  });

  it("should call the submit function and close the modal when the save button is clicked", async () => {
    (
      mockFormik.submitForm as MockedFunction<typeof mockFormik.submitForm>
    ).mockResolvedValue(undefined);
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AddTransactionModal slug="test-slug" budgetItems={mockBudgetItems} />
      </LocalizationProvider>,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Add Transaction/i }),
    );

    const dialog = screen.getByRole("dialog");

    await userEvent.click(screen.getByRole("button", { name: /Save/i }));

    expect(mockFormik.submitForm).toHaveBeenCalled();
    await waitForElementToBeRemoved(dialog);
  });
});
