import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { formatToCurrency } from "@/lib/utils";
import { useMemo } from "react";
import { BudgetSummary } from "@/types/api";

interface BudgetSummaryTotalsProps {
  budget?: BudgetSummary | undefined;
  isLoading: boolean;
}

export default function BudgetSummaryTotals({
  budget,
  isLoading,
}: BudgetSummaryTotalsProps) {
  const gainOrLoss = useMemo(() => {
    if (
      budget?.actualIncome === undefined ||
      budget?.actualExpenses === undefined
    ) {
      return 0;
    }
    return budget.actualIncome - budget.actualExpenses;
  }, [budget?.actualIncome, budget?.actualExpenses]);

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      sx={{ m: 2 }}
      justifyContent={"space-around"}
      spacing={2}
      data-testid="budget-summary-totals-stack"
    >
      <Card sx={{ minWidth: 200, flex: 1 }}>
        <CardContent>
          <Typography align={"center"} variant={"h5"} gutterBottom>
            Expected Income
          </Typography>
          <Typography
            color={"success.main"}
            align={"center"}
            variant={"h6"}
            data-testid={"expected-income"}
          >
            {isLoading ? (
              <Skeleton width={"75%"} data-testid="skeleton" />
            ) : (
              formatToCurrency(budget?.expectedIncome)
            )}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 200, flex: 1 }}>
        <CardContent>
          <Typography align={"center"} variant={"h5"} gutterBottom>
            Actual Income
          </Typography>
          <Typography
            color={"success.main"}
            align={"center"}
            variant={"h6"}
            data-testid={"actual-income"}
          >
            {isLoading ? (
              <Skeleton width={"75%"} data-testid="skeleton" />
            ) : (
              formatToCurrency(budget?.actualIncome)
            )}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 200, flex: 1 }}>
        <CardContent>
          <Typography align={"center"} variant={"h5"} gutterBottom>
            Expected Expenses
          </Typography>
          <Typography
            color={"error"}
            align={"center"}
            variant={"h6"}
            data-testid={"expected-expenses"}
          >
            {isLoading ? (
              <Skeleton width={"75%"} data-testid="skeleton" />
            ) : (
              formatToCurrency(budget?.expectedExpenses)
            )}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 200, flex: 1 }}>
        <CardContent>
          <Typography align={"center"} variant={"h5"} gutterBottom>
            Actual Expenses
          </Typography>
          <Typography
            color={"error"}
            align={"center"}
            variant={"h6"}
            data-testid={"actual-expenses"}
          >
            {isLoading ? (
              <Skeleton width={"75%"} data-testid="skeleton" />
            ) : (
              formatToCurrency(budget?.actualExpenses)
            )}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 200, flex: 1 }}>
        <CardContent>
          <Typography align={"center"} variant={"h5"} gutterBottom>
            Gain/Loss
          </Typography>
          <Typography
            color={gainOrLoss >= 0 ? "success.main" : "error"}
            align={"center"}
            variant={"h6"}
            data-testid={"gain-loss"}
          >
            {isLoading ? (
              <Skeleton width={"75%"} data-testid="skeleton" />
            ) : (
              formatToCurrency(gainOrLoss)
            )}
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
