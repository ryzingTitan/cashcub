"use client";

import { getBudgetSummary } from "@/lib/budgets";
import { BudgetSummary as BudgetSummaryType } from "@/types/api";
import { useParams } from "next/navigation";
import useSWR from "swr";

export const useBudgetSummary = () => {
  const params = useParams();
  const key = params.budgetId ? `/budgets/${params.budgetId}` : null;
  const { data, isLoading, error } = useSWR<BudgetSummaryType>(
    key,
    getBudgetSummary,
  );

  return {
    budget: data,
    isLoading,
    error,
  };
};
