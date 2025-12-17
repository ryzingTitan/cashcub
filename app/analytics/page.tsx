"use client";

import { Skeleton, Stack, Box } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAnalyticsData } from "@/hooks/features/analytics/hooks";
import DatePickers from "@/components/features/analytics/DatePickers";
import BudgetItemGraph from "@/components/features/budgets/BudgetItemGraph";
import CashFlowGraph from "@/components/features/analytics/CashFlowGraph";
import CategoryGraph from "@/components/features/analytics/CategoryGraph";
import {
  LineChartSkeleton,
  BarChartSkeleton,
  PieChartSkeleton,
} from "@/components/ui/skeletons";

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
        <Stack spacing={2} alignItems={"center"} sx={{ m: 2, width: "100%" }}>
          {/* Date picker skeleton */}
          <Skeleton
            variant="rectangular"
            width={{ xs: "90%", md: "75%" }}
            height={40}
            data-testid="skeleton"
          />

          {/* CashFlowGraph skeleton */}
          <Box sx={{ width: { xs: "90%", md: "75%" } }}>
            <LineChartSkeleton height={300} lineCount={2} testId="skeleton" />
          </Box>

          {/* BudgetItemGraph skeleton */}
          <Box sx={{ width: { xs: "90%", md: "75%" } }}>
            <BarChartSkeleton height={300} barCount={6} testId="skeleton" />
          </Box>

          {/* CategoryGraph skeleton */}
          <Box sx={{ width: { xs: "90%", md: "75%" } }}>
            <PieChartSkeleton
              height={300}
              legendItemCount={5}
              testId="skeleton"
            />
          </Box>
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
