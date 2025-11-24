"use client";

import { BudgetSummary as BudgetSummaryType } from "@/types/api";
import { useParams } from "next/navigation";
import { useApi } from "./useApi";

export const useBudgetSummary = () => {
  const params = useParams();
  const key = params.slug ? `/api/budgets/${params.slug}` : null;
  const { data, isLoading, error } = useApi<BudgetSummaryType>(key);

  return {
    budget: data,
    isLoading,
    error,
  };
};
