import { BudgetSummary } from "@/types/api";
import { PieChart } from "@mui/x-charts";
import useSWR from "swr";
import { getAllCategories } from "@/lib/categories";
import Typography from "@mui/material/Typography";

interface CategoryGraphProps {
  budgets?: BudgetSummary[] | undefined;
  loading: boolean;
}

export default function CategoryGraph({
  budgets,
  loading,
}: CategoryGraphProps) {
  const { data: categories, isLoading: categoriesLoading } = useSWR(
    "/categories",
    getAllCategories,
  );

  const totalsByCategory = new Map<string, number>();
  for (const budget of budgets ?? []) {
    for (const item of budget.budgetItems) {
      const amount = (item.actualAmount ?? item.plannedAmount ?? 0) as number;
      totalsByCategory.set(
        item.categoryId,
        (totalsByCategory.get(item.categoryId) ?? 0) + amount,
      );
    }
  }

  const nameById = new Map<string, string>(
    (categories ?? []).map((c) => [c.id, c.name]),
  );

  const pieData = Array.from(totalsByCategory.entries()).map(
    ([categoryId, value]) => ({
      id: categoryId,
      label: nameById.get(categoryId) ?? categoryId,
      value,
    }),
  );

  return (
    <>
      <Typography align="center" sx={{ m: 2 }}>
        Totals by Category
      </Typography>
      <PieChart
        sx={{ pb: 7 }}
        loading={loading || categoriesLoading}
        series={[
          {
            data: pieData,
          },
        ]}
        height={300}
      />
    </>
  );
}
