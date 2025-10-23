import * as yup from "yup";

export const budgetItemValidationSchema = yup.object({
  plannedAmount: yup
    .number()
    .moreThan(0, "Planned amount must be greater than 0")
    .required("Planned amount is required"),
  name: yup.string().required("Name is required"),
});
