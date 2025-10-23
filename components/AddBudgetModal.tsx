import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { useToggle } from "usehooks-ts";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useSWRConfig } from "swr";
import { createBudget } from "@/lib/budgets";
import { Budget } from "@/types/api";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

export default function AddBudgetModal() {
  const [value, toggle] = useToggle(false);
  const [budgetMonthAndYear, setBudgetMonthAndYear] = useState<Dayjs | null>(
    dayjs(),
  );
  const { mutate } = useSWRConfig();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleSave = async () => {
    if (!budgetMonthAndYear) {
      return;
    }

    try {
      const newBudget: Budget = {
        id: null,
        month: budgetMonthAndYear.month() + 1,
        year: budgetMonthAndYear.year(),
      };
      const createdBudget = await createBudget("/budgets", newBudget);
      await mutate("/budgets");
      enqueueSnackbar("Budget created", { variant: "success" });
      router.push(`/budgets/${createdBudget.id}`);
      toggle();
    } catch (error) {
      enqueueSnackbar("Failed to create budget", { variant: "error" });
    }
  };

  const handleClose = () => {
    toggle();
    setBudgetMonthAndYear(dayjs());
  };

  return (
    <>
      <Tooltip title="Add Budget">
        <IconButton>
          <AddIcon onClick={toggle} />
        </IconButton>
      </Tooltip>
      <Dialog open={value} onClose={handleClose}>
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
