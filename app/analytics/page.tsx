"use client";

import { Stack, Box, Fade } from "@mui/material";
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
    <Stack spacing={2} alignItems="center" sx={{ m: 2 }}>
      {/* DatePickers always visible - not dependent on data */}
      <DatePickers
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      {/* Each chart manages its own loading state with fade transition */}
      <Fade in={!isLoading} timeout={300}>
        <Box sx={{ width: { xs: "90%", md: "75%" } }}>
          {isLoading ? (
            <LineChartSkeleton height={300} lineCount={2} />
          ) : (
            <CashFlowGraph budgets={data} loading={false} />
          )}
        </Box>
      </Fade>

      <Fade in={!isLoading} timeout={400}>
        <Box sx={{ width: { xs: "90%", md: "75%" } }}>
          {isLoading ? (
            <BarChartSkeleton height={300} barCount={6} />
          ) : (
            <BudgetItemGraph budgets={data} loading={false} />
          )}
        </Box>
      </Fade>

      <Fade in={!isLoading} timeout={500}>
        <Box sx={{ width: { xs: "90%", md: "75%" } }}>
          {isLoading ? (
            <PieChartSkeleton height={300} legendItemCount={5} />
          ) : (
            <CategoryGraph budgets={data} />
          )}
        </Box>
      </Fade>
    </Stack>
  );
}
