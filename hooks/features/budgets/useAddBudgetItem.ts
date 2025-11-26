import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useSWRConfig } from "swr";
import { useToggle } from "usehooks-ts";
import { createBudgetItem } from "@/lib/budgets";
import { BudgetItem } from "@/types/api";
import { budgetItemValidationSchema } from "@/types/validations";

interface UseAddBudgetItemProps {
  budgetId?: string;
  categoryId?: string;
}

export function useAddBudgetItem({
  budgetId,
  categoryId,
}: UseAddBudgetItemProps) {
  const [isOpen, toggle] = useToggle(false);
  const { mutate } = useSWRConfig();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      plannedAmount: 0,
      name: "",
    },
    validationSchema: budgetItemValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!budgetId || !categoryId) {
        enqueueSnackbar("Budget or category ID is missing", {
          variant: "error",
        });
        setSubmitting(false);
        return;
      }

      try {
        const newBudgetItem: Partial<BudgetItem> = {
          plannedAmount: Number(values.plannedAmount),
          name: values.name,
          categoryId: categoryId,
        };
        await createBudgetItem(`/budgets/${budgetId}/items`, newBudgetItem);
        await mutate(`/budgets/${budgetId}`);
        enqueueSnackbar("Budget item created", { variant: "success" });
        toggle();
        resetForm();
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Failed to create budget item", { variant: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    toggle();
    formik.resetForm();
  };

  return {
    isOpen,
    toggle,
    formik,
    handleClose,
  };
}
