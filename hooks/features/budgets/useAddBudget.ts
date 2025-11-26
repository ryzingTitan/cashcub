import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useToggle } from "usehooks-ts";
import { useSWRConfig } from "swr";
import { createBudget } from "@/lib/budgets";
import { Budget } from "@/types/api";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";

async function createBudgetFetcher(
  url: string,
  { arg }: { arg: Partial<Budget> },
) {
  return createBudget(url, arg);
}

export function useAddBudget() {
  const [isOpen, toggle, setIsOpen] = useToggle(false);
  const [budgetMonthAndYear, setBudgetMonthAndYear] = useState<Dayjs | null>(
    dayjs(),
  );
  const { mutate } = useSWRConfig();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const { trigger, isMutating } = useSWRMutation(
    "/budgets",
    createBudgetFetcher,
    {
      onSuccess: async (data) => {
        await mutate("/budgets");
        enqueueSnackbar("Budget created", { variant: "success" });
        router.push(`/budgets/${data.id}`);
        setIsOpen(false);
      },
      onError: (error) => {
        console.error(error);
        enqueueSnackbar("Failed to create budget", { variant: "error" });
      },
    },
  );

  const handleSave = async () => {
    if (!budgetMonthAndYear) {
      return;
    }

    const newBudget: Partial<Budget> = {
      month: budgetMonthAndYear.month() + 1,
      year: budgetMonthAndYear.year(),
    };
    await trigger(newBudget);
  };

  const handleClose = () => {
    setIsOpen(false);
    setBudgetMonthAndYear(dayjs());
  };

  return {
    isOpen,
    toggle,
    budgetMonthAndYear,
    setBudgetMonthAndYear,
    handleSave,
    handleClose,
    isMutating,
  };
}
