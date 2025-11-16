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
  const sortedBudgets =
    budgets?.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    }) ?? [];

  const itemKeys = Array.from(
    new Set(sortedBudgets.flatMap((b) => b.budgetItems.map((bi) => bi.name))),
  );

  const chartData = sortedBudgets.map((budget) => {
    const itemMap = new Map<string, number>();
    for (const item of budget.budgetItems) {
      const amount = (item.actualAmount ?? item.plannedAmount ?? 0) as number;
      itemMap.set(item.name, (itemMap.get(item.name) ?? 0) + amount);
    }

    const dataEntry: Record<string, unknown> = {
      x: { month: budget.month, year: budget.year },
    };
    for (const key of itemKeys) {
      dataEntry[key] = itemMap.get(key) ?? 0;
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
            valueFormatter: (value) => `${value.month}/${value.year}`,
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
