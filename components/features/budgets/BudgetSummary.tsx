"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import BudgetCategories from "@/components/features/budgets/BudgetCategories";
import BudgetSummaryTotals from "@/components/features/budgets/BudgetSummaryTotals";
import { useBudgetSummary } from "@/hooks/features/budgets/useBudgetSummary";

export default function BudgetSummary() {
  const { budget, isLoading, error } = useBudgetSummary();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.push("/error");
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <Stack spacing={2} data-testid="loading-skeleton">
        <Skeleton variant="rectangular" height={80} />
        <Skeleton variant="rectangular" height={120} />
      </Stack>
    );
  }

  if (error) {
    return null;
  }

  return (
    <Stack sx={{ pb: 7 }} data-testid="budget-summary">
      <BudgetSummaryTotals budget={budget} isLoading={isLoading} />
      <BudgetCategories budget={budget} />
    </Stack>
  );
}
