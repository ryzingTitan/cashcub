"use client";

import { BudgetSummary } from "@/types/api";
import { BarChart } from "@mui/x-charts";
import { formatToCurrency } from "@/lib/utils";
import Typography from "@mui/material/Typography";
import { useBudgetItemGraph } from "@/hooks/features/budgets/useBudgetItemGraph";
import { memo } from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

interface BudgetItemGraphProps {
  budgets?: BudgetSummary[] | undefined;
  loading: boolean;
}

function BudgetItemGraph({ budgets, loading }: BudgetItemGraphProps) {
  const { chartData, itemKeys } = useBudgetItemGraph(budgets);

  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        height={300}
        data-testid="budget-item-graph-skeleton"
      />
    );
  }

  return (
    <Box>
      <Typography align="center" sx={{ m: 2 }}>
        Totals by Budget Item
      </Typography>
      <BarChart
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
          valueFormatter: (value: number | null) => formatToCurrency(value),
        }))}
        height={300}
      />
    </Box>
  );
}

export default memo(BudgetItemGraph);
