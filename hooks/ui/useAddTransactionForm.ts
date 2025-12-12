"use client";

import { useFormik } from "formik";
import * as yup from "yup";
import { transactionValidationSchema } from "@/types/validations";
import { useParams } from "next/navigation";
import { useSWRConfig } from "swr";
import { useSnackbar } from "notistack";
import dayjs, { Dayjs } from "dayjs";
import { Transaction, TransactionType } from "@/types/api";
import { createTransaction } from "@/lib/transactions";
import { useState } from "react";

export const useAddTransactionForm = (
  onSuccess?: () => void,
  initialBudgetItemId?: string,
) => {
  const [transactionDate, setTransactionDate] = useState<Dayjs | null>(dayjs());
  const { mutate } = useSWRConfig();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();

  const formik = useFormik({
    initialValues: {
      amount: "",
      transactionType: "",
      merchant: "",
      notes: "",
      budgetItemId: initialBudgetItemId || "",
    },
    validateOnMount: true,
    validationSchema: transactionValidationSchema.concat(
      yup.object({
        budgetItemId: yup
          .string()
          .uuid()
          .required("Budget item id is required"),
      }),
    ),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const newTransaction: Partial<Transaction> = {
          date: transactionDate!.toISOString(),
          amount: Number(values.amount),
          transactionType: values.transactionType as TransactionType,
          merchant: values.merchant.trim() === "" ? null : values.merchant,
          notes: values.notes.trim() === "" ? null : values.notes,
        };
        await createTransaction(
          `/budgets/${params.slug}/items/${values.budgetItemId}/transactions`,
          newTransaction,
        );
        await mutate(
          `/budgets/${params.slug}/items/${values.budgetItemId}/transactions`,
        );
        enqueueSnackbar("Transaction created", { variant: "success" });
        resetForm();
        setTransactionDate(dayjs());
        onSuccess?.();
      } catch (error) {
        console.error("Failed to create transaction:", error);
        enqueueSnackbar("Failed to create transaction", { variant: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return { formik, transactionDate, setTransactionDate };
};
