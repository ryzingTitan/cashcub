"use client";

import { BudgetSummary } from "@/types/api";
import { LineChart } from "@mui/x-charts";
import { formatToCurrency } from "@/lib/utils";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useMemo } from "react";

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
  const chartData: CashFlowDatasetRow[] = useMemo(() => {
    // Sort the budgets by year and then by month
    const sortedBudgets = budgets
      ? [...budgets].sort((a, b) => {
          if (a.year !== b.year) {
            return a.year - b.year;
          }
          return a.month - b.month;
        })
      : [];

    // Map the sorted budgets to the chart data format with cumulative totals
    return sortedBudgets.reduce<CashFlowDatasetRow[]>((acc, budget) => {
      const previousRow = acc[acc.length - 1];
      const totalExpenses =
        (previousRow?.actualExpenses || 0) + budget.actualExpenses;
      const totalIncome =
        (previousRow?.actualIncome || 0) + budget.actualIncome;

      acc.push({
        x: `${budget.month}/${budget.year}`,
        actualIncome: totalIncome,
        actualExpenses: totalExpenses,
      });

      return acc;
    }, []);
  }, [budgets]);

  return (
    <>
      <Typography align="center" sx={{ m: 2 }}>
        Cash Flow
      </Typography>

      {chartData.length === 0 && !loading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 300,
          }}
        >
          <Typography>No cash flow data to display.</Typography>
        </Box>
      ) : (
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
      )}
    </>
  );
}
