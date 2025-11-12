"use client";

import BudgetList from "@/components/BudgetList";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Stack from "@mui/material/Stack";
import AddBudgetModal from "@/components/AddBudgetModal";
import CloneBudgetModal from "@/components/CloneBudgetModal";

export default function BudgetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <CloneBudgetModal />
        </Stack>
        {children}
      </SnackbarProvider>
    </LocalizationProvider>
  );
}
