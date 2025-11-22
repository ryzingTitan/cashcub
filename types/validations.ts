import * as yup from "yup";

export const budgetItemValidationSchema = yup.object({
  plannedAmount: yup
    .number()
    .moreThan(0, "Planned amount must be greater than 0")
    .required("Planned amount is required"),
  name: yup.string().required("Name is required"),
});

export const transactionValidationSchema = yup.object({
  amount: yup
    .number()
    .moreThan(0, "Amount must be greater than 0")
    .required("Amount is required"),
  merchant: yup.string().optional(),
  notes: yup.string().optional(),
  transactionType: yup
    .string()
    .oneOf(["INCOME", "EXPENSE"])
    .required("Transaction type is required"),
});
