"use client";

import Autocomplete from "@mui/material/Autocomplete";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";

import { useBudgetList } from "@/hooks/useBudgetList";

export default function BudgetList() {
  const {
    budgets,
    isLoading,
    selectedBudget,
    handleBudgetChange,
    getOptionLabel,
  } = useBudgetList();

  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width={300}
        height={56}
        data-testid="budget-list-skeleton"
      />
    );
  }

  return (
    <Autocomplete
      disablePortal
      value={selectedBudget}
      options={budgets}
      loading={isLoading}
      sx={{ width: 300 }}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => <TextField {...params} label="Budget" />}
      onChange={handleBudgetChange}
    />
  );
}
