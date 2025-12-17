import useSWR from "swr";
import React, { memo } from "react";
import { getAllCategories } from "@/lib/categories";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AddBudgetItemModal from "@/components/features/budgets/AddBudgetItemModal";
import Divider from "@mui/material/Divider";
import { BudgetItem, BudgetSummary } from "@/types/api";
import List from "@mui/material/List";
import BudgetItemSummary from "@/components/features/budgets/BudgetItemSummary";
import { CategoryCardSkeleton } from "@/components/ui/skeletons";

interface BudgetCategoriesProps {
  budget?: BudgetSummary | undefined;
}

function BudgetCategories({ budget }: BudgetCategoriesProps) {
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
  }, [budget]);

  return (
    <Grid
      container
      spacing={2}
      sx={{ p: 2 }}
      data-testid="budget-categories-list"
    >
      {isLoading ? (
        <>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 12, md: 6 }}>
              <CategoryCardSkeleton
                itemCount={2}
                testId={`category-skeleton-${i}`}
              />
            </Grid>
          ))}
        </>
      ) : (
        data?.map((item) => {
          const itemsForCategory = budgetItemsByCategoryId.get(item.id) || [];
          return (
            <Grid key={item.id} size={{ xs: 12, sm: 12, md: 6 }}>
              <Card
                sx={{ height: "100%" }}
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
            </Grid>
          );
        })
      )}
    </Grid>
  );
}

export default memo(BudgetCategories);
