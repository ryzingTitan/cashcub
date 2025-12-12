"use client";

import { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from "@mui/x-date-pickers";
import InputAdornment from "@mui/material/InputAdornment";
import { useAddTransactionForm } from "@/hooks/ui/useAddTransactionForm";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { getBudgetSummary } from "@/lib/budgets";

interface AddTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  budgetItemId?: string;
}

export default function AddTransactionDialog({
  open,
  onClose,
  budgetItemId,
}: AddTransactionDialogProps) {
  const params = useParams();
  const { data } = useSWR(`/budgets/${params.slug}`, getBudgetSummary);

  const { formik, transactionDate, setTransactionDate } =
    useAddTransactionForm(onClose, budgetItemId);

  // Reset the budget item ID when the dialog opens with a pre-selected item
  useEffect(() => {
    if (open && budgetItemId) {
      formik.setFieldValue("budgetItemId", budgetItemId);
    }
  }, [open, budgetItemId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formik.handleSubmit();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box component="form" onSubmit={handleSubmit}>
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
                  formik.touched.transactionType &&
                  Boolean(formik.errors.transactionType)
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
              error={formik.touched.merchant && Boolean(formik.errors.merchant)}
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
          <Button onClick={onClose} disabled={formik.isSubmitting}>
            Cancel
          </Button>
          <Button
            type={"submit"}
            disabled={!formik.isValid || formik.isSubmitting}
            autoFocus
          >
            {formik.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
