"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";

export const useApi = <T>(url: string) => {
  const { data, error, isLoading } = useSWR<T>(url, fetcher);

  return {
    data,
    error,
    isLoading,
  };
};
