"use client";

import BudgetSummary from "@/components/BudgetSummary";
import AddTransactionModal from "@/components/AddTransactionModal";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { getBudgetSummary } from "@/lib/budgets";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";

export default function Budget() {
  const router = useRouter();
  const params = useParams();
  const { data, isLoading, error } = useSWR(
    `/budgets/${params.slug}`,
    getBudgetSummary,
  );

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    router.push("/error");
    return null;
  }

  return (
    <>
      <BudgetSummary />
      <AddTransactionModal
        slug={params.slug as string}
        budgetItems={data?.budgetItems ?? []}
      />
    </>
  );
}
