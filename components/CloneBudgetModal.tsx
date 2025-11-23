"use client";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import { DatePicker } from "@mui/x-date-pickers";
import { useCloneBudget } from "@/hooks/useCloneBudget";

export default function CloneBudgetModal({
  budgetId,
}: {
  budgetId: string | string[] | undefined;
}) {
  const {
    isModalOpen,
    toggleModal,
    budgetMonthAndYear,
    setBudgetMonthAndYear,
    handleSave,
    handleClose,
  } = useCloneBudget(budgetId);

  return (
    <>
      <Tooltip title="Clone Budget">
        <IconButton disabled={!budgetId} onClick={toggleModal}>
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={isModalOpen} onClose={handleClose}>
        <DialogTitle>Clone Budget</DialogTitle>
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
