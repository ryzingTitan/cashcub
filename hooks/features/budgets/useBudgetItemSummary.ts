import { useToggle } from "usehooks-ts";
import { useSWRConfig } from "swr";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { budgetItemValidationSchema } from "@/types/validations";
import { deleteBudgetItem, updateBudgetItem } from "@/lib/budgets";
import { BudgetItem } from "@/types/api";

export function useBudgetItemSummary(budgetItem: BudgetItem) {
  const [isEditing, toggle] = useToggle(false);
  const { mutate } = useSWRConfig();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      plannedAmount: budgetItem.plannedAmount,
      name: budgetItem.name,
    },
    enableReinitialize: true,
    validationSchema: budgetItemValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const updatedBudgetItem: Partial<BudgetItem> = {
          plannedAmount: Number(values.plannedAmount),
          name: values.name,
          categoryId: budgetItem.categoryId,
        };
        await updateBudgetItem(
          `/budgets/${budgetItem.budgetId}/items/${budgetItem.id}`,
          updatedBudgetItem,
        );
        await mutate(`/budgets/${budgetItem.budgetId}`);
        enqueueSnackbar("Budget item updated", { variant: "success" });
        toggle();
        resetForm();
      } catch (error) {
        console.error("Failed to update budget item:", error);
        enqueueSnackbar("Failed to update budget item", { variant: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCancel = () => {
    toggle();
    formik.resetForm();
  };

  const handleDelete = async () => {
    try {
      await deleteBudgetItem(
        `/budgets/${budgetItem.budgetId}/items/${budgetItem.id}`,
      );
      await mutate(`/budgets/${budgetItem.budgetId}`);
      enqueueSnackbar("Budget item deleted", { variant: "success" });
    } catch (error) {
      console.error("Failed to delete budget item:", error);
      enqueueSnackbar("Failed to delete budget item", { variant: "error" });
    }
  };

  return {
    isEditing,
    formik,
    toggle,
    handleCancel,
    handleDelete,
  };
}
