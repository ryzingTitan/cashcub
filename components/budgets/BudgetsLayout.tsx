"use client";

import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function BudgetsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        preventDuplicate={true}
      >
        <div data-testid="budgets-layout">{children}</div>
      </SnackbarProvider>
    </LocalizationProvider>
  );
}
