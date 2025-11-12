import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
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
import { cloneBudget } from "@/lib/budgets";
import { Budget } from "@/types/api";
import { useSnackbar } from "notistack";
import { useParams, useRouter } from "next/navigation";

export default function CloneBudgetModal() {
  const params = useParams();
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
      const clonedBudget = await cloneBudget(
        `/budgets/${params.slug}/clone`,
        newBudget,
      );
      await mutate("/budgets");
      enqueueSnackbar("Budget cloned", { variant: "success" });
      router.push(`/budgets/${clonedBudget.id}`);
      toggle();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to clone budget", { variant: "error" });
    }
  };

  const handleClose = () => {
    toggle();
    setBudgetMonthAndYear(dayjs());
  };

  return (
    <>
      <Tooltip title="Clone Budget">
        <IconButton disabled={!params.slug}>
          <ContentCopyIcon onClick={toggle} />
        </IconButton>
      </Tooltip>
      <Dialog open={value} onClose={handleClose}>
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
