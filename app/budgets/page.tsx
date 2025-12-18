import { redirect } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { getAllBudgets } from "@/lib/budgets";
import { Budget } from "@/types/api";
import { auth0, loginUrl } from "@/lib/auth0";

export default async function Budgets() {
  const session = await auth0.getSession();

  if (!session) {
    redirect(loginUrl);
  }

  let budgets: Budget[] | null = null;

  try {
    budgets = await getAllBudgets("/budgets");
  } catch (error) {
    // Redirect to error page on API failure
    redirect("/error");
  }

  if (!budgets || budgets.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          padding: 3,
        }}
      >
        <Typography variant="h5" color="text.secondary">
          No budgets found. Create your first budget!
        </Typography>
      </Box>
    );
  }

  // Sort budgets by year and month (ascending) - matches useBudgetList logic
  const sortedBudgets = budgets.slice().sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }
    return a.month - b.month;
  });

  // Get most recent budget (last element in sorted array)
  const mostRecentBudget = sortedBudgets[sortedBudgets.length - 1];

  // Redirect to most recent budget
  redirect(`/budgets/${mostRecentBudget.id}`);
}
