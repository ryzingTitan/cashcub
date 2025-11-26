"use client";

import BudgetList from "@/components/features/budgets/BudgetList";
import Stack from "@mui/material/Stack";
import AddBudgetModal from "@/components/features/budgets/AddBudgetModal";
import CloneBudgetModal from "@/components/features/budgets/CloneBudgetModal";
import BudgetsLayout from "@/components/features/budgets/BudgetsLayout";
import { useBudgetList } from "@/hooks/features/budgets/useBudgetList";

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
