"use client";

import { Skeleton, Stack } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAnalyticsData } from "@/hooks/analytics/hooks";
import DatePickers from "@/components/analytics/DatePickers";
import BudgetItemGraph from "@/components/BudgetItemGraph";
import CashFlowGraph from "@/components/CashFlowGraph";
import CategoryGraph from "@/components/CategoryGraph";

export default function Analytics() {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const router = useRouter();
  const { data, isLoading, error } = useAnalyticsData(startDate, endDate);

  if (error) {
    router.push("/error");
  }

  return (
    <>
      {isLoading ? (
        <Stack spacing={2} alignItems={"center"} sx={{ m: 2 }}>
          <Skeleton
            variant="rectangular"
            width={"75%"}
            height={40}
            data-testid="skeleton"
          />
          <Skeleton
            variant="rectangular"
            width={"75%"}
            height={400}
            data-testid="skeleton"
          />
          <Skeleton
            variant="rectangular"
            width={"75%"}
            height={400}
            data-testid="skeleton"
          />
          <Skeleton
            variant="rectangular"
            width={"75%"}
            height={400}
            data-testid="skeleton"
          />
        </Stack>
      ) : (
        <>
          <DatePickers
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <CashFlowGraph budgets={data} loading={isLoading} />
          <BudgetItemGraph budgets={data} loading={isLoading} />
          <CategoryGraph budgets={data} />
        </>
      )}
    </>
  );
}
