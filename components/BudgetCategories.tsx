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

interface BudgetCategoriesProps {
  budget?: BudgetSummary | undefined;
}

export default function BudgetCategories({ budget }: BudgetCategoriesProps) {
  const { data, error, isLoading } = useSWR(`/categories`, getAllCategories);

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
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  );
}
