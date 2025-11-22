"use client";

import Stack from "@mui/material/Stack";
import BudgetSummaryTotals from "@/components/BudgetSummaryTotals";
import BudgetCategories from "@/components/BudgetCategories";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { getBudgetSummary } from "@/lib/budgets";

export default function BudgetSummary() {
  const params = useParams();
  const { data, isLoading } = useSWR(
    `/budgets/${params.slug}`,
    getBudgetSummary,
  );

  return (
    <Stack sx={{ pb: 7 }}>
      <BudgetSummaryTotals budget={data} isLoading={isLoading} />
      <BudgetCategories budget={data} />
    </Stack>
  );
}
