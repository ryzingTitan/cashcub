import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
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
      direction={{ xs: "column", sm: "row" }}
      sx={{ m: 2 }}
      justifyContent={"space-around"}
      spacing={2}
    >
      <Stack>
        <Typography align={"center"} variant={"h5"}>
          Expected Income
        </Typography>
        <Typography
          color={"success.main"}
          align={"center"}
          variant={"h6"}
          data-testid={"expected-income"}
        >
          {isLoading ? (
            <Skeleton width={100} data-testid="skeleton" />
          ) : (
            formatToCurrency(budget?.expectedIncome)
          )}
        </Typography>
      </Stack>
      <Stack>
        <Typography align={"center"} variant={"h5"}>
          Actual Income
        </Typography>
        <Typography
          color={"success.main"}
          align={"center"}
          variant={"h6"}
          data-testid={"actual-income"}
        >
          {isLoading ? (
            <Skeleton width={100} data-testid="skeleton" />
          ) : (
            formatToCurrency(budget?.actualIncome)
          )}
        </Typography>
      </Stack>
      <Stack>
        <Typography align={"center"} variant={"h5"}>
          Expected Expenses
        </Typography>
        <Typography
          color={"error"}
          align={"center"}
          variant={"h6"}
          data-testid={"expected-expenses"}
        >
          {isLoading ? (
            <Skeleton width={100} data-testid="skeleton" />
          ) : (
            formatToCurrency(budget?.expectedExpenses)
          )}
        </Typography>
      </Stack>
      <Stack>
        <Typography align={"center"} variant={"h5"}>
          Actual Expenses
        </Typography>
        <Typography
          color={"error"}
          align={"center"}
          variant={"h6"}
          data-testid={"actual-expenses"}
        >
          {isLoading ? (
            <Skeleton width={100} data-testid="skeleton" />
          ) : (
            formatToCurrency(budget?.actualExpenses)
          )}
        </Typography>
      </Stack>
      <Stack>
        <Typography align={"center"} variant={"h5"}>
          Gain/Loss
        </Typography>
        <Typography
          color={gainOrLoss >= 0 ? "success.main" : "error"}
          align={"center"}
          variant={"h6"}
          data-testid={"gain-loss"}
        >
          {isLoading ? (
            <Skeleton width={100} data-testid="skeleton" />
          ) : (
            formatToCurrency(gainOrLoss)
          )}
        </Typography>
      </Stack>
    </Stack>
  );
}
