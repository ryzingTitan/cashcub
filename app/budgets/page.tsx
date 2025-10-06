"use client";

import BudgetList from "@/components/BudgetList";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Stack from "@mui/material/Stack";
import AddBudgetModal from "@/components/AddBudgetModal";

export default function Budgets() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        preventDuplicate={true}
      >
        <Stack
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          sx={{ m: 2 }}
          spacing={2}
        >
          <BudgetList />
          <AddBudgetModal />
        </Stack>
      </SnackbarProvider>
    </LocalizationProvider>
  );
}
