import { BudgetSummary } from "@/types/api";
import { BarChart } from "@mui/x-charts";
import { formatToCurrency } from "@/lib/utils";
import Typography from "@mui/material/Typography";

interface BudgetItemGraphProps {
  budgets?: BudgetSummary[] | undefined;
  loading: boolean;
}

export default function BudgetItemGraph({
  budgets,
  loading,
}: BudgetItemGraphProps) {
  // Each dataset row must provide a categorical "x" (band scale) and numeric series values.
  type BudgetDatasetRow = { x: string } & Record<string, number>;
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

    // Use a string label for band scale on the x-axis (e.g., "3/2025").
    const dataEntry: BudgetDatasetRow = {
      x: `${budget.month}/${budget.year}`,
    } as BudgetDatasetRow;
    for (const key of itemKeys) {
      // Populate numeric series values; missing keys default to 0.
      (dataEntry as Record<string, number | string>)[key] =
        itemMap.get(key) ?? 0;
    }
    return dataEntry;
  });

  return (
    <>
      <Typography align="center" sx={{ m: 2 }}>
        Totals by Budget Item
      </Typography>

      <BarChart
        loading={loading}
        dataset={chartData}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "x",
          },
        ]}
        yAxis={[
          {
            width: 75,
            valueFormatter: (value: number | null) => formatToCurrency(value),
          },
        ]}
        series={itemKeys.map((key) => ({
          dataKey: key,
          stack: "total",
          label: key,
        }))}
        height={300}
      />
    </>
  );
}
