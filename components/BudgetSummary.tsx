"use client";

import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import BudgetCategories from "@/components/BudgetCategories";
import BudgetSummaryTotals from "@/components/BudgetSummaryTotals";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";

export default function BudgetSummary() {
  const { budget, isLoading, error } = useBudgetSummary();

  if (isLoading) {
    return (
      <Stack spacing={2} data-testid="loading-skeleton">
        <Skeleton variant="rectangular" height={80} />
        <Skeleton variant="rectangular" height={120} />
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="error" data-testid="error-alert">
        There was an error loading the budget summary.
      </Alert>
    );
  }

  return (
    <Stack sx={{ pb: 7 }} data-testid="budget-summary">
      <BudgetSummaryTotals budget={budget} isLoading={isLoading} />
      <BudgetCategories budget={budget} />
    </Stack>
  );
}
