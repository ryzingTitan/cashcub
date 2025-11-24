"use client";

import BudgetList from "@/components/BudgetList";
import Stack from "@mui/material/Stack";
import AddBudgetModal from "@/components/AddBudgetModal";
import CloneBudgetModal from "@/components/CloneBudgetModal";
import BudgetsLayout from "@/components/budgets/BudgetsLayout";
import { useBudgetList } from "@/hooks/useBudgetList";

export default function BudgetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { selectedBudget } = useBudgetList();
  return (
    <BudgetsLayout>
      <Stack
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{ m: 2 }}
        spacing={2}
      >
        <BudgetList />
        <AddBudgetModal />
        <CloneBudgetModal budgetId={selectedBudget?.id} />
      </Stack>
      {children}
    </BudgetsLayout>
  );
}
