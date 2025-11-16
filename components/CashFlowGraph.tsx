import { BudgetSummary } from "@/types/api";
import { LineChart } from "@mui/x-charts";
import { formatToCurrency } from "@/lib/utils";
import Typography from "@mui/material/Typography";

interface CashFlowGraphProps {
  budgets?: BudgetSummary[] | undefined;
  loading: boolean;
}

export default function CashFlowGraph({
  budgets,
  loading,
}: CashFlowGraphProps) {
  let totalExpenses = 0;
  let totalIncome = 0;
  const chartData =
    budgets
      ?.sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return a.month - b.month;
      })
      .map((budget) => {
        totalExpenses += budget.actualExpenses;
        totalIncome += budget.actualIncome;
        return {
          x: { month: budget.month, year: budget.year },
          actualIncome: totalIncome,
          actualExpenses: totalExpenses,
        };
      }) ?? [];

  return (
    <>
      <Typography align="center" sx={{ m: 2 }}>
        Cash Flow
      </Typography>

      <LineChart
        loading={loading}
        dataset={chartData}
        xAxis={[
          {
            scaleType: "point",
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
        series={[
          {
            dataKey: "actualIncome",
            label: "Income",
            valueFormatter: (value: number | null) => formatToCurrency(value),
          },
          {
            dataKey: "actualExpenses",
            label: "Expenses",
            valueFormatter: (value: number | null) => formatToCurrency(value),
          },
        ]}
        height={300}
      />
    </>
  );
}
