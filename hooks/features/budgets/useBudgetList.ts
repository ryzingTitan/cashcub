import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import dayjs from "dayjs";

import { getAllBudgets } from "@/lib/budgets";
import { Budget } from "@/types/api";

export function useBudgetList() {
  const { data, isLoading, error } = useSWR(`/budgets`, getAllBudgets);
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
    return data?.find((budget) => budget.id === params.budgetId) ?? null;
  }, [params.budgetId, data]);

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
