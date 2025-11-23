"use client";

import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useSWRConfig } from "swr";
import { cloneBudget } from "@/lib/budgets";
import { Budget } from "@/types/api";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useToggle } from "usehooks-ts";

export function useCloneBudget(budgetId: string | string[] | undefined) {
  const [isModalOpen, toggleModal] = useToggle(false);
  const [budgetMonthAndYear, setBudgetMonthAndYear] = useState<Dayjs | null>(
    dayjs(),
  );
  const { mutate } = useSWRConfig();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleSave = async () => {
    if (!budgetMonthAndYear || !budgetId) {
      return;
    }

    try {
      const newBudget: Partial<Budget> = {
        month: budgetMonthAndYear.month() + 1,
        year: budgetMonthAndYear.year(),
      };
      const clonedBudget = await cloneBudget(
        `/budgets/${budgetId}/clone`,
        newBudget,
      );
      await mutate("/budgets");
      enqueueSnackbar("Budget cloned", { variant: "success" });
      router.push(`/budgets/${clonedBudget.id}`);
      toggleModal();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to clone budget", { variant: "error" });
    }
  };

  const handleClose = () => {
    toggleModal();
    setBudgetMonthAndYear(dayjs());
  };

  return {
    isModalOpen,
    toggleModal,
    budgetMonthAndYear,
    setBudgetMonthAndYear,
    handleSave,
    handleClose,
  };
}
