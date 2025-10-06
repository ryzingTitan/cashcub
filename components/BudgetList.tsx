import useSWR from "swr";
import { getAllBudgets } from "@/lib/budgets";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import dayjs from "dayjs";

export default function BudgetList() {
  const { data, isLoading } = useSWR(`/budgets`, getAllBudgets);

  return (
    <Autocomplete
      disablePortal
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
      // onChange={}
    />
  );
}
