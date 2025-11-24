"use client";

import { useToggle } from "usehooks-ts";
import { useSWRConfig } from "swr";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { budgetItemValidationSchema } from "@/types/validations";
import { fetchWithAuth } from "@/lib/api";
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
    validationSchema: budgetItemValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const updatedBudgetItem: Partial<BudgetItem> = {
          plannedAmount: Number(values.plannedAmount),
          name: values.name,
          categoryId: budgetItem.categoryId,
        };
        await fetchWithAuth(
          `/api/budgets/${budgetItem.budgetId}/items/${budgetItem.id}`,
          {
            method: "PUT",
            body: updatedBudgetItem,
          },
        );
        await mutate(`/api/budgets/${budgetItem.budgetId}`);
        enqueueSnackbar("Budget item updated", { variant: "success" });
        toggle();
        resetForm();
      } catch (error) {
        console.log(error);
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
      await fetchWithAuth(
        `/api/budgets/${budgetItem.budgetId}/items/${budgetItem.id}`,
        {
          method: "DELETE",
        },
      );
      await mutate(`/api/budgets/${budgetItem.budgetId}`);
      enqueueSnackbar("Budget item deleted", { variant: "success" });
    } catch (error) {
      console.log(error);
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
