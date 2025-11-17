import { BudgetSummary } from "@/types/api";
import { LineChart } from "@mui/x-charts";
import { formatToCurrency } from "@/lib/utils";
import Typography from "@mui/material/Typography";

interface CashFlowGraphProps {
  budgets?: BudgetSummary[] | undefined;
  loading: boolean;
}

// Dataset row for the line chart: use a string label for the x value to satisfy band/point scale typing.
type CashFlowDatasetRow = {
  x: string;
  actualIncome: number;
  actualExpenses: number;
} & Record<string, number | string>;

export default function CashFlowGraph({
  budgets,
  loading,
}: CashFlowGraphProps) {
  let totalExpenses = 0;
  let totalIncome = 0;
  const chartData: CashFlowDatasetRow[] =
    budgets
      ?.sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return a.month - b.month;
      })
      .map((budget): CashFlowDatasetRow => {
        totalExpenses += budget.actualExpenses;
        totalIncome += budget.actualIncome;
        return {
          x: `${budget.month}/${budget.year}`,
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
            area: true,
          },
          {
            dataKey: "actualExpenses",
            label: "Expenses",
            valueFormatter: (value: number | null) => formatToCurrency(value),
            area: true,
          },
        ]}
        height={300}
      />
    </>
  );
}
