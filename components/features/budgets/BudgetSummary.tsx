"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import BudgetCategories from "@/components/features/budgets/BudgetCategories";
import BudgetSummaryTotals from "@/components/features/budgets/BudgetSummaryTotals";
import { useBudgetSummary } from "@/hooks/features/budgets/useBudgetSummary";
import {
  BudgetSummaryCardSkeleton,
  CategoryCardSkeleton,
} from "@/components/ui/skeletons";

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
      <Stack sx={{ pb: 7 }} data-testid="loading-skeleton">
        {/* BudgetSummaryTotals skeleton */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{ m: 2 }}
          justifyContent="space-around"
          spacing={2}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <BudgetSummaryCardSkeleton key={i} />
          ))}
        </Stack>

        {/* BudgetCategories skeleton */}
        <Grid container spacing={2} sx={{ p: 2 }}>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 12, md: 6 }}>
              <CategoryCardSkeleton itemCount={2} />
            </Grid>
          ))}
        </Grid>
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
