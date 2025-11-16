"use client";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Stack from "@mui/material/Stack";
import useSWR from "swr";
import { getAnalyticsData } from "@/lib/analytics";
import CashFlowGraph from "@/components/CashFlowGraph";

export default function Analytics() {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  const { data, isLoading, mutate } = useSWR(
    ["/analytics", startDate?.format("MM-YYYY"), endDate?.format("MM-YYYY")],
    getAnalyticsData,
  );

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack
          spacing={2}
          justifyContent={"center"}
          direction={"row"}
          sx={{ m: 2 }}
        >
          <DatePicker
            label="Start Date"
            views={["year", "month"]}
            format="MM/YYYY"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            sx={{ m: 2 }}
          />
          <DatePicker
            label="End Date"
            views={["year", "month"]}
            format="MM/YYYY"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            sx={{ m: 2 }}
          />
        </Stack>
      </LocalizationProvider>
      <CashFlowGraph budgets={data} />
    </>
  );
}
