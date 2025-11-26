import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import { DatePicker } from "@mui/x-date-pickers";
import { useAddBudget } from "@/hooks/features/budgets/useAddBudget";

export default function AddBudgetModal() {
  const {
    isOpen,
    toggle,
    budgetMonthAndYear,
    setBudgetMonthAndYear,
    handleSave,
    handleClose,
  } = useAddBudget();

  return (
    <>
      <Tooltip title="Add Budget">
        <IconButton onClick={toggle}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Add Budget</DialogTitle>
        <DialogContent>
          <DatePicker
            label="New Budget"
            views={["year", "month"]}
            format="MM/YYYY"
            value={budgetMonthAndYear}
            onChange={(newValue) => setBudgetMonthAndYear(newValue)}
            sx={{ m: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
