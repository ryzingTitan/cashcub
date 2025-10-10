"use client";

import useSWR from "swr";
import { getBudgetSummary } from "@/lib/budgets";
import { useParams } from "next/navigation";
import Stack from "@mui/material/Stack";
import BudgetSummaryTotals from "@/components/BudgetSummaryTotals";
import BudgetCategories from "@/components/BudgetCategories";

export default function BudgetSummary() {
  return (
    <Stack>
      <BudgetSummaryTotals />
      <BudgetCategories />
    </Stack>
  );
}
