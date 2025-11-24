"use client";

import BudgetList from "@/components/BudgetList";
import Stack from "@mui/material/Stack";
import AddBudgetModal from "@/components/AddBudgetModal";
import CloneBudgetModal from "@/components/CloneBudgetModal";
import BudgetsLayout from "@/components/budgets/BudgetsLayout";

export default function BudgetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BudgetsLayout>
      <Stack
        direction={{ xs: "column", sm: "row" }}
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
    </BudgetsLayout>
  );
}
