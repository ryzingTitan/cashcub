import { useMemo } from "react";
import { BudgetSummary } from "@/types/api";

type BudgetDatasetRow = { x: string } & Record<string, number>;

export const useBudgetItemGraph = (budgets: BudgetSummary[] | undefined) => {
  const { chartData, itemKeys } = useMemo(() => {
    const sortedBudgets =
      budgets?.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      }) ?? [];

    const itemKeys = Array.from(
      new Set(sortedBudgets.flatMap((b) => b.budgetItems.map((bi) => bi.name))),
    );

    const chartData: BudgetDatasetRow[] = sortedBudgets.map((budget) => {
      const itemMap = new Map<string, number>();
      for (const item of budget.budgetItems) {
        const amount = (item.actualAmount ?? item.plannedAmount ?? 0) as number;
        itemMap.set(item.name, (itemMap.get(item.name) ?? 0) + amount);
      }

      const dataEntry: BudgetDatasetRow = {
        x: `${budget.month}/${budget.year}`,
      } as BudgetDatasetRow;
      for (const key of itemKeys) {
        (dataEntry as Record<string, number | string>)[key] =
          itemMap.get(key) ?? 0;
      }
      return dataEntry;
    });

    return { chartData, itemKeys };
  }, [budgets]);

  return { chartData, itemKeys };
};
