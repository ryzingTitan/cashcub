import useSWR from "swr";
import React from "react";
import { getAllCategories } from "@/lib/categories";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AddBudgetItemModal from "@/components/features/budgets/AddBudgetItemModal";
import Divider from "@mui/material/Divider";
import { BudgetItem, BudgetSummary } from "@/types/api";
import List from "@mui/material/List";
import BudgetItemSummary from "@/components/features/budgets/BudgetItemSummary";

interface BudgetCategoriesProps {
  budget?: BudgetSummary | undefined;
}

export default function BudgetCategories({ budget }: BudgetCategoriesProps) {
  const { data, isLoading } = useSWR(`/categories`, getAllCategories);
  const budgetItemsByCategoryId = React.useMemo(() => {
    if (!budget?.budgetItems) {
      return new Map();
    }
    return budget.budgetItems.reduce((acc, item) => {
      const items = acc.get(item.categoryId) || [];
      items.push(item);
      acc.set(item.categoryId, items);
      return acc;
    }, new Map());
  }, [budget?.budgetItems]);

  return (
    <Stack
      spacing={2}
      alignItems={"center"}
      data-testid="budget-categories-list"
    >
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          width={"75%"}
          height={120}
          data-testid="loading-skeleton"
        />
      ) : (
        data?.map((item) => {
          const itemsForCategory = budgetItemsByCategoryId.get(item.id) || [];
          return (
            <Card
              key={item.id}
              sx={{ minWidth: "75%" }}
              data-testid={`category-card-${item.id}`}
            >
              <CardContent>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Typography variant={"h6"}>{item.name}</Typography>
                  <AddBudgetItemModal
                    budgetId={budget?.id}
                    categoryId={item.id}
                  />
                </Stack>
                <Divider sx={{ m: 2 }} />
                <List>
                  {itemsForCategory.map((budgetItem: BudgetItem) => (
                    <BudgetItemSummary
                      budgetItem={budgetItem}
                      categoryName={item.name}
                      key={budgetItem.id}
                    />
                  ))}
                </List>
              </CardContent>
            </Card>
          );
        })
      )}
    </Stack>
  );
}
