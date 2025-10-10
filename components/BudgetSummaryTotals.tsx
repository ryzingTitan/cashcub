import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { formatToCurrency } from "@/lib/utils";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { getBudgetSummary } from "@/lib/budgets";

export default function BudgetSummaryTotals() {
  const params = useParams();
  const { data, isLoading } = useSWR(
    `/budgets/${params.slug}`,
    getBudgetSummary,
  );

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
          Expected Income:
        </Typography>
        <Typography color={"success"} align={"center"} variant={"h6"}>
          {isLoading ? <Skeleton /> : formatToCurrency(data?.expectedIncome)}
        </Typography>
      </Stack>

      <Stack>
        <Typography align={"center"} variant={"h5"}>
          Actual Income:
        </Typography>
        <Typography color={"success"} align={"center"} variant={"h6"}>
          {isLoading ? <Skeleton /> : formatToCurrency(data?.actualIncome)}
        </Typography>
      </Stack>
      <Stack>
        <Typography align={"center"} variant={"h5"}>
          Expected Expenses:
        </Typography>
        <Typography color={"error"} align={"center"} variant={"h6"}>
          {isLoading ? <Skeleton /> : formatToCurrency(data?.expectedExpenses)}
        </Typography>
      </Stack>
      <Stack>
        <Typography align={"center"} variant={"h5"}>
          Actual Expenses:
        </Typography>
        <Typography color={"error"} align={"center"} variant={"h6"}>
          {isLoading ? <Skeleton /> : formatToCurrency(data?.actualExpenses)}
        </Typography>
      </Stack>
      <Stack>
        <Typography align={"center"} variant={"h5"}>
          Gain/Loss:
        </Typography>
        <Typography
          color={
            calculateGainOrLoss(data?.actualIncome, data?.actualExpenses) >= 0
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
              calculateGainOrLoss(data?.actualIncome, data?.actualExpenses),
            )
          )}
        </Typography>
      </Stack>
    </Stack>
  );
}
