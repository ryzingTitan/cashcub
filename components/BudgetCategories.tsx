import useSWR from "swr";
import { getAllCategories } from "@/lib/categories";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AddBudgetItemModal from "@/components/AddBudgetItemModal";
import Divider from "@mui/material/Divider";
import { BudgetSummary } from "@/types/api";
import List from "@mui/material/List";
import BudgetItemSummary from "@/components/BudgetItemSummary";

interface BudgetCategoriesProps {
  budget?: BudgetSummary | undefined;
}

export default function BudgetCategories({ budget }: BudgetCategoriesProps) {
  const { data, isLoading } = useSWR(`/categories`, getAllCategories);

  return (
    <Stack spacing={2} alignItems={"center"}>
      {isLoading ? (
        <Skeleton variant="rectangular" width={"75%"} height={120} />
      ) : (
        data?.map((item) => (
          <Card key={item.id} sx={{ minWidth: "75%" }}>
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
                {budget?.budgetItems
                  .filter((budgetItem) => budgetItem.categoryId === item.id)
                  .map((budgetItem) => (
                    <BudgetItemSummary
                      budgetItem={budgetItem}
                      categoryName={item.name}
                      key={budgetItem.id}
                    />
                  ))}
              </List>
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  );
}
