"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { PieChart } from "@mui/x-charts";
import Typography from "@mui/material/Typography";
import { BudgetSummary } from "@/types/api";
import { getAllCategories } from "@/lib/categories";
import { formatToCurrency } from "@/lib/utils";

interface CategoryGraphProps {
  budgets?: BudgetSummary[];
}

export default function CategoryGraph({ budgets }: CategoryGraphProps) {
  const router = useRouter();
  const {
    data: categories,
    isLoading: categoriesLoading,
    error,
  } = useSWR("/categories", getAllCategories);

  if (error) {
    router.push("/error");
  }

  const pieData = useMemo(() => {
    if (!budgets || !categories) {
      return [];
    }

    const totalsByCategory = new Map<string, number>();
    for (const budget of budgets) {
      for (const item of budget.budgetItems) {
        const amount = (item.actualAmount ?? item.plannedAmount ?? 0) as number;
        totalsByCategory.set(
          item.categoryId,
          (totalsByCategory.get(item.categoryId) ?? 0) + amount,
        );
      }
    }

    const nameById = new Map<string, string>(
      categories.map((c) => [c.id, c.name]),
    );

    return Array.from(totalsByCategory.entries()).map(
      ([categoryId, value]) => ({
        id: categoryId,
        label: nameById.get(categoryId) ?? categoryId,
        value,
      }),
    );
  }, [budgets, categories]);

  return (
    <>
      <Typography align="center" sx={{ m: 2 }}>
        Totals by Category
      </Typography>
      <PieChart
        sx={{ pb: 7 }}
        loading={categoriesLoading}
        series={[
          {
            data: pieData,
            valueFormatter: ({ value }) => formatToCurrency(value),
          },
        ]}
        height={300}
      />
    </>
  );
}
