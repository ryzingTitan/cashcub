"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Budget } from "@/types/api";
import { useApi } from "@/hooks/useApi";

export function useBudgetList() {
  const { data, isLoading, error } = useApi<Budget[]>(`/api/budgets`);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.push("/error");
    }
  }, [error, router]);

  const sortedData = useMemo(() => {
    return (
      data?.slice().sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return a.month - b.month;
      }) ?? []
    );
  }, [data]);

  const selectedBudget = useMemo(() => {
    return data?.find((budget) => budget.id === params.slug) ?? null;
  }, [params.slug, data]);

  const handleBudgetChange = (_event: unknown, value: Budget | null) => {
    if (!value) {
      router.push("/budgets");
    } else {
      router.push(`/budgets/${value.id}`);
    }
  };

  const getOptionLabel = (option: Budget) =>
    `${dayjs()
      .month(option.month - 1)
      .format("MMMM")} ${option.year}`;

  return {
    budgets: sortedData,
    isLoading,
    selectedBudget,
    handleBudgetChange,
    getOptionLabel,
  };
}
