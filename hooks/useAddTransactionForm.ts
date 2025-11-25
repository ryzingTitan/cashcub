"use client";

import { useFormik } from "formik";
import * as yup from "yup";
import { transactionValidationSchema } from "@/types/validations";
import { useSWRConfig } from "swr";
import { useSnackbar } from "notistack";
import dayjs, { Dayjs } from "dayjs";
import { Transaction, TransactionType } from "@/types/api";
import { createTransaction } from "@/lib/transactions";
import { useState } from "react";

interface UseAddTransactionFormProps {
  slug: string;
}

export const useAddTransactionForm = ({ slug }: UseAddTransactionFormProps) => {
  const [transactionDate, setTransactionDate] = useState<Dayjs | null>(dayjs());
  const { mutate } = useSWRConfig();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      amount: 0,
      transactionType: "",
      merchant: "",
      notes: "",
      budgetItemId: "",
    },
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
          `/budgets/${slug}/items/${values.budgetItemId}/transactions`,
          newTransaction,
        );
        await mutate(
          `/budgets/${slug}/items/${values.budgetItemId}/transactions`,
        );
        await mutate(`/budgets/${slug}`);
        enqueueSnackbar("Transaction created", { variant: "success" });
        resetForm();
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Failed to create transaction", { variant: "error" });
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
  });

  return { formik, transactionDate, setTransactionDate };
};
