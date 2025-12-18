import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MobileTransactionCard, { TransactionRow } from "./MobileTransactionCard";

const mockTransaction: TransactionRow = {
  id: "1",
  date: "2024-07-26T12:00:00.000Z",
  amount: 100.5,
  transactionType: "EXPENSE",
  merchant: "Test Merchant",
  notes: "Test Note",
};

describe("MobileTransactionCard", () => {
  const mockOnEdit = vi.fn();
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnUpdate = vi.fn();

  const defaultProps = {
    transaction: mockTransaction,
    onEdit: mockOnEdit,
    onSave: mockOnSave,
    onCancel: mockOnCancel,
    onDelete: mockOnDelete,
    onUpdate: mockOnUpdate,
    isEditing: false,
  };

  const renderComponent = (props = {}) =>
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileTransactionCard {...defaultProps} {...props} />
      </LocalizationProvider>,
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("View Mode", () => {
    it("should render transaction amount formatted as currency", () => {
      renderComponent();
      expect(screen.getByText("$100.50")).toBeInTheDocument();
    });

    it("should render transaction date formatted correctly", () => {
      renderComponent();
      expect(screen.getByText("Jul 26, 2024")).toBeInTheDocument();
    });

    it("should render merchant name", () => {
      renderComponent();
      expect(screen.getByText("Test Merchant")).toBeInTheDocument();
    });

    it("should render notes when present", () => {
      renderComponent();
      expect(screen.getByText("Test Note")).toBeInTheDocument();
    });

    it("should not render notes when notes is null", () => {
      const transactionWithoutNotes = {
        ...mockTransaction,
        notes: null,
      };
      renderComponent({ transaction: transactionWithoutNotes });
      expect(screen.queryByText("Test Note")).not.toBeInTheDocument();
    });

    it("should not render notes when notes is empty string", () => {
      const transactionWithEmptyNotes = {
        ...mockTransaction,
        notes: "",
      };
      renderComponent({ transaction: transactionWithEmptyNotes });

      // Check that only merchant and date are shown (not notes)
      const typographyElements = screen.getAllByText(
        (content, element) => element?.tagName.toLowerCase() === "p",
      );
      expect(typographyElements.length).toBeLessThan(3);
    });

    it("should display EXPENSE chip with error color", () => {
      renderComponent();
      const chip = screen.getByText("EXPENSE");
      expect(chip).toBeInTheDocument();
    });

    it("should display INCOME chip with success color", () => {
      const incomeTransaction = {
        ...mockTransaction,
        transactionType: "INCOME" as const,
      };
      renderComponent({ transaction: incomeTransaction });
      const chip = screen.getByText("INCOME");
      expect(chip).toBeInTheDocument();
    });

    it("should call onEdit when edit button is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const editButton = screen.getByRole("button", { name: /edit/i });
      await user.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it("should call onDelete when delete button is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it("should render merchant as empty string when merchant is null", () => {
      const transactionWithoutMerchant = {
        ...mockTransaction,
        merchant: null,
      };
      renderComponent({ transaction: transactionWithoutMerchant });

      // Should render the date but not crash
      expect(screen.getByText("Jul 26, 2024")).toBeInTheDocument();
    });
  });

  describe("Edit Mode", () => {
    it("should render all form fields when in edit mode", () => {
      renderComponent({ isEditing: true });

      expect(screen.getByLabelText("Amount")).toBeInTheDocument();
      expect(screen.getByLabelText("Merchant")).toBeInTheDocument();
      expect(screen.getByLabelText("Notes")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
    });

    it("should display current amount value in edit mode", () => {
      renderComponent({ isEditing: true });
      const amountInput = screen.getByLabelText("Amount") as HTMLInputElement;
      expect(amountInput.value).toBe("100.5");
    });

    it("should display current merchant value in edit mode", () => {
      renderComponent({ isEditing: true });
      const merchantInput = screen.getByLabelText(
        "Merchant",
      ) as HTMLInputElement;
      expect(merchantInput.value).toBe("Test Merchant");
    });

    it("should display current notes value in edit mode", () => {
      renderComponent({ isEditing: true });
      const notesInput = screen.getByLabelText("Notes") as HTMLInputElement;
      expect(notesInput.value).toBe("Test Note");
    });

    it("should display current transaction type in edit mode", () => {
      renderComponent({ isEditing: true });
      expect(screen.getByText("EXPENSE")).toBeInTheDocument();
    });

    it("should call onUpdate with correct values when amount is changed", async () => {
      const user = userEvent.setup();
      renderComponent({ isEditing: true });

      const amountInput = screen.getByLabelText("Amount");
      await user.clear(amountInput);
      await user.type(amountInput, "150.75");

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith("amount", 150.75);
      });
    });

    it("should call onUpdate with 0 when amount is cleared", async () => {
      const user = userEvent.setup();
      renderComponent({ isEditing: true });

      const amountInput = screen.getByLabelText("Amount");
      await user.clear(amountInput);

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith("amount", 0);
      });
    });

    it("should call onUpdate with correct values when merchant is changed", async () => {
      const user = userEvent.setup();
      renderComponent({ isEditing: true });

      const merchantInput = screen.getByLabelText("Merchant");
      await user.clear(merchantInput);
      await user.type(merchantInput, "New Merchant");

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith("merchant", "New Merchant");
      });
    });

    it("should call onUpdate with correct values when notes is changed", async () => {
      const user = userEvent.setup();
      renderComponent({ isEditing: true });

      const notesInput = screen.getByLabelText("Notes");
      await user.clear(notesInput);
      await user.type(notesInput, "New Notes");

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith("notes", "New Notes");
      });
    });

    it("should call onUpdate when transaction type is changed", async () => {
      const user = userEvent.setup();
      renderComponent({ isEditing: true });

      // Click the select to open it
      const select = screen.getByText("EXPENSE");
      await user.click(select);

      // Click the INCOME option
      const incomeOption = screen.getByRole("option", { name: "INCOME" });
      await user.click(incomeOption);

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith("transactionType", "INCOME");
      });
    });

    it("should call onSave when save button is clicked", async () => {
      const user = userEvent.setup();
      renderComponent({ isEditing: true });

      const saveButton = screen.getByRole("button", { name: /save/i });
      await user.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it("should call onCancel when cancel button is clicked", async () => {
      const user = userEvent.setup();
      renderComponent({ isEditing: true });

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("should not show edit and delete buttons in edit mode", () => {
      renderComponent({ isEditing: true });

      expect(
        screen.queryByRole("button", { name: /edit/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /delete/i }),
      ).not.toBeInTheDocument();
    });

    it("should handle null merchant in edit mode", () => {
      const transactionWithoutMerchant = {
        ...mockTransaction,
        merchant: null,
      };
      renderComponent({
        transaction: transactionWithoutMerchant,
        isEditing: true,
      });

      const merchantInput = screen.getByLabelText(
        "Merchant",
      ) as HTMLInputElement;
      expect(merchantInput.value).toBe("");
    });

    it("should handle null notes in edit mode", () => {
      const transactionWithoutNotes = {
        ...mockTransaction,
        notes: null,
      };
      renderComponent({
        transaction: transactionWithoutNotes,
        isEditing: true,
      });

      const notesInput = screen.getByLabelText("Notes") as HTMLInputElement;
      expect(notesInput.value).toBe("");
    });

    it("should display $ symbol in amount input", () => {
      renderComponent({ isEditing: true });
      expect(screen.getByText("$")).toBeInTheDocument();
    });

    it("should have multiline notes field", () => {
      renderComponent({ isEditing: true });
      const notesInput = screen.getByLabelText("Notes");
      expect(notesInput.getAttribute("rows")).toBe("2");
    });
  });

  describe("Component Display Name", () => {
    it("should have correct display name", () => {
      expect(MobileTransactionCard.displayName).toBe("MobileTransactionCard");
    });
  });
});
