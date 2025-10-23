import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { formatToCurrency } from "@/lib/utils";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { BudgetSummary } from "@/types/api";

interface BudgetSummaryTotalsProps {
  budget?: BudgetSummary | undefined;
}

export default function BudgetSummaryTotals({
  budget,
}: BudgetSummaryTotalsProps) {
  const params = useParams();
  const { isLoading } = useSWR(`/budgets/${params.slug}`);

  const calculateGainOrLoss = (
    actualIncome: number | undefined,
    actualExpenses: number | undefined,
  ): number => {
    if (actualIncome === undefined || actualExpenses === undefined) {
      return 0;
    }
    return actualIncome - actualExpenses;
  };

  return (
    <Stack direction={"row"} sx={{ m: 2 }} justifyContent={"space-around"}>
      <Stack>
        <Typography align={"center"} variant={"h5"}>
          Expected Income
        </Typography>
        <Typography color={"success"} align={"center"} variant={"h6"}>
          {isLoading ? <Skeleton /> : formatToCurrency(budget?.expectedIncome)}
        </Typography>
      </Stack>

      <Stack>
        <Typography align={"center"} variant={"h5"}>
          Actual Income
        </Typography>
        <Typography color={"success"} align={"center"} variant={"h6"}>
          {isLoading ? <Skeleton /> : formatToCurrency(budget?.actualIncome)}
        </Typography>
      </Stack>
      <Stack>
        <Typography align={"center"} variant={"h5"}>
          Expected Expenses
        </Typography>
        <Typography color={"error"} align={"center"} variant={"h6"}>
          {isLoading ? (
            <Skeleton />
          ) : (
            formatToCurrency(budget?.expectedExpenses)
          )}
        </Typography>
      </Stack>
      <Stack>
        <Typography align={"center"} variant={"h5"}>
          Actual Expenses
        </Typography>
        <Typography color={"error"} align={"center"} variant={"h6"}>
          {isLoading ? <Skeleton /> : formatToCurrency(budget?.actualExpenses)}
        </Typography>
      </Stack>
      <Stack>
        <Typography align={"center"} variant={"h5"}>
          Gain/Loss
        </Typography>
        <Typography
          color={
            calculateGainOrLoss(budget?.actualIncome, budget?.actualExpenses) >=
            0
              ? "success"
              : "error"
          }
          align={"center"}
          variant={"h6"}
        >
          {isLoading ? (
            <Skeleton />
          ) : (
            formatToCurrency(
              calculateGainOrLoss(budget?.actualIncome, budget?.actualExpenses),
            )
          )}
        </Typography>
      </Stack>
    </Stack>
  );
}
