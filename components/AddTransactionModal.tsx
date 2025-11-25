"use client";

import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
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
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { useAddTransactionForm } from "@/hooks/useAddTransactionForm";
import { BudgetItem } from "@/types/api";

interface AddTransactionModalProps {
  slug: string;
  budgetItems: BudgetItem[];
}

export default function AddTransactionModal({
  slug,
  budgetItems,
}: AddTransactionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { formik, transactionDate, setTransactionDate } = useAddTransactionForm(
    { slug },
  );

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    formik.resetForm();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await formik.submitForm();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Tooltip title={"Add Transaction"}>
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={handleOpen}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      <Dialog open={isOpen} onClose={handleClose}>
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
                  {budgetItems.map((budgetItem) => (
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
