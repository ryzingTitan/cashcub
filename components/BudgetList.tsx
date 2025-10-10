import useSWR from "swr";
import { getAllBudgets } from "@/lib/budgets";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { Budget } from "@/types/api";
import { useEffect, useState } from "react";

export default function BudgetList() {
  const { data, error, isLoading } = useSWR(`/budgets`, getAllBudgets);
  const params = useParams();
  const router = useRouter();
  const [value, setValue] = useState<Budget | null>(
    data?.find((budget) => budget.id === params.slug) ?? null,
  );

  useEffect(() => {
    setValue(data?.find((budget) => budget.id === params.slug) ?? null);
  }, [params.slug, data]);

  return (
    <Autocomplete
      disablePortal
      value={value}
      options={
        data?.sort((a, b) => {
          if (a.year !== b.year) {
            return a.year - b.year;
          }

          return a.month - b.month;
        }) ?? []
      }
      loading={isLoading}
      sx={{ width: 300 }}
      getOptionLabel={(option) =>
        `${dayjs()
          .month(option.month - 1)
          .format("MMMM")} ${option.year}`
      }
      renderInput={(params) => <TextField {...params} label="Budget" />}
      onChange={(_event, value) => {
        setValue(value);
        if (!value) {
          router.push("/budgets");
        } else {
          router.push(`/budgets/${value?.id}`);
        }
      }}
    />
  );
}
