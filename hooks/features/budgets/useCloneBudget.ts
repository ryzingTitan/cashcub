"use client";

import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useSWRConfig } from "swr";
import { cloneBudget } from "@/lib/budgets";
import { Budget } from "@/types/api";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useToggle } from "usehooks-ts";
import useSWRMutation from "swr/mutation";

async function cloneBudgetFetcher(
  url: string,
  { arg }: { arg: Partial<Budget> },
) {
  return cloneBudget(url, arg);
}

export function useCloneBudget(budgetId: string | string[] | undefined | null) {
  const [isModalOpen, toggleModal] = useToggle(false);
  const [budgetMonthAndYear, setBudgetMonthAndYear] = useState<Dayjs | null>(
    dayjs(),
  );
  const { mutate } = useSWRConfig();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const { trigger, isMutating } = useSWRMutation(
    budgetId ? `/budgets/${budgetId}/clone` : null,
    cloneBudgetFetcher,
    {
      onSuccess: async (data) => {
        await mutate("/budgets");
        enqueueSnackbar("Budget cloned", { variant: "success" });
        router.push(`/budgets/${data.id}`);
        toggleModal();
        setBudgetMonthAndYear(dayjs());
      },
      onError: (error) => {
        console.error("Failed to clone budget:", error);
        enqueueSnackbar("Failed to clone budget", { variant: "error" });
      },
    },
  );

  const handleSave = async () => {
    if (!budgetMonthAndYear || !budgetId) {
      return;
    }

    const newBudget: Partial<Budget> = {
      month: budgetMonthAndYear.month() + 1,
      year: budgetMonthAndYear.year(),
    };
    await trigger(newBudget);
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
    isMutating,
  };
}
