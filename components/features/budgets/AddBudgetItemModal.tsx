import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { useAddBudgetItem } from "@/hooks/features/budgets/useAddBudgetItem";

interface AddBudgetItemModalProps {
  budgetId?: string | undefined;
  categoryId?: string;
}

export default function AddBudgetItemModal({
  budgetId,
  categoryId,
}: AddBudgetItemModalProps) {
  const { isOpen, toggle, formik, handleClose } = useAddBudgetItem({
    budgetId,
    categoryId,
  });

  return (
    <>
      <Tooltip title="Add Budget Item">
        <IconButton onClick={toggle}>
          <AddIcon fontSize={"small"} />
        </IconButton>
      </Tooltip>
      <Dialog open={isOpen} onClose={handleClose}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <DialogTitle>Add Budget Item</DialogTitle>
          <DialogContent>
            <Stack>
              <TextField
                required
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                sx={{ m: 2 }}
              />
              <TextField
                required
                label="Planned Amount"
                name="plannedAmount"
                value={formik.values.plannedAmount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.plannedAmount &&
                  Boolean(formik.errors.plannedAmount)
                }
                helperText={
                  formik.touched.plannedAmount && formik.errors.plannedAmount
                }
                sx={{ m: 2 }}
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
