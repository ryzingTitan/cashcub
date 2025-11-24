"use client";

import { useApi } from "@/hooks/useApi";
import { BudgetSummary } from "@/types/api";
import { Dayjs } from "dayjs";

export function useAnalyticsData(
  startDate: Dayjs | null,
  endDate: Dayjs | null,
) {
  const url =
    startDate && endDate
      ? `/api/analytics?startDate=${startDate.format(
          "YYYY-MM-DD",
        )}&endDate=${endDate.format("YYYY-MM-DD")}`
      : null;
  const { data, isLoading, error } = useApi<BudgetSummary[]>(url);

  return {
    data,
    isLoading,
    error,
  };
}
