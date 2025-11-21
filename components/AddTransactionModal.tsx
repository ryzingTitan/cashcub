"use client";

import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import useSWR, { useSWRConfig } from "swr";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { Transaction } from "@/types/api";
import { useToggle } from "usehooks-ts";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import dayjs, { Dayjs } from "dayjs";
import * as yup from "yup";
import { useParams } from "next/navigation";
import { createTransaction } from "@/lib/transactions";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from "@mui/x-date-pickers";
import { getBudgetSummary } from "@/lib/budgets";
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";

export default function AddTransactionModal() {
  const [value, toggle] = useToggle(false);
  const [transactionDate, setTransactionDate] = useState<Dayjs | null>(dayjs());
  const { mutate } = useSWRConfig();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const { data } = useSWR(`/budgets/${params.slug}`, getBudgetSummary);

  const transactionValidationSchema = yup.object({
    amount: yup
      .number()
      .moreThan(0, "Amount must be greater than 0")
      .required("Amount is required"),
    merchant: yup.string().optional(),
    notes: yup.string().optional(),
    budgetItemId: yup.string().uuid().required("Budget item id is required"),
    transactionType: yup
      .string()
      .oneOf(["INCOME", "EXPENSE"])
      .required("Transaction type is required"),
  });

  const formik = useFormik({
    initialValues: {
      amount: 0,
      transactionType: "",
      merchant: "",
      notes: "",
      budgetItemId: "",
    },
    validationSchema: transactionValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const newTransaction: Partial<Transaction> = {
          date: transactionDate!.toISOString(),
          amount: Number(values.amount),
          transactionType: values.transactionType,
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
        toggle();
        resetForm();
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Failed to create transaction", { variant: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    toggle();
    formik.resetForm();
  };

  return (
    <>
      <Tooltip title={"Add Transaction"}>
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={toggle}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      <Dialog open={value} onClose={handleClose}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ m: 2 }}>
              <DatePicker
                value={transactionDate}
                label="Transaction Date"
                onChange={(newValue) => setTransactionDate(newValue)}
              />
              <FormControl fullWidth>
                <InputLabel id="budgetItem-label">Budget Item</InputLabel>
                <Select
                  labelId="budgetItem-label"
                  value={formik.values.budgetItemId}
                  label="Budget Item"
                  name="budgetItemId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.budgetItemId &&
                    Boolean(formik.errors.budgetItemId)
                  }
                >
                  {data?.budgetItems.map((budgetItem) => (
                    <MenuItem key={budgetItem.id!} value={budgetItem.id!}>
                      {budgetItem.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="transactionType-label">
                  Transaction Type
                </InputLabel>
                <Select
                  labelId="transactionType-label"
                  value={formik.values.transactionType}
                  label="Transaction Type"
                  name="transactionType"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.budgetItemId &&
                    Boolean(formik.errors.budgetItemId)
                  }
                >
                  <MenuItem value="EXPENSE">EXPENSE</MenuItem>
                  <MenuItem value="INCOME">INCOME</MenuItem>
                </Select>
              </FormControl>
              <TextField
                required
                label="Amount"
                name="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Merchant"
                name="merchant"
                value={formik.values.merchant}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.merchant && Boolean(formik.errors.merchant)
                }
                helperText={formik.touched.merchant && formik.errors.merchant}
              />
              <TextField
                label="Notes"
                name="notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type={"submit"} disabled={!formik.isValid} autoFocus>
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
