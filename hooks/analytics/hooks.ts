"use client";

import useSWR from "swr";
import { getAnalyticsData } from "@/lib/analytics";
import { Dayjs } from "dayjs";

export function useAnalyticsData(startDate: Dayjs | null, endDate: Dayjs | null) {
  const { data, isLoading, error } = useSWR(
    ["/analytics", startDate?.format("MM-YYYY"), endDate?.format("MM-YYYY")],
    getAnalyticsData,
  );

  return {
    data,
    isLoading,
    error,
  };
}
