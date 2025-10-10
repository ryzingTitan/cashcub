import useSWR from "swr";
import { BudgetItem } from "@/types/api";
import Stack from "@mui/material/Stack";
import BudgetSummaryTotals from "@/components/BudgetSummaryTotals";

interface BudgetCategoriesProps {
  budgetItems?: BudgetItem[] | undefined;
  isLoading?: boolean;
}

export default function BudgetCategories({
  budgetItems,
  isLoading,
}: BudgetCategoriesProps) {
  // const params = useParams();
  // const { data, error } = useSWR(
  //     `/budgets/${params.slug}`,
  //     getBudgetSummary,
  // );
  //

  // const {data, error, isLoading} = useSWR(
  //     `/categories`,
  //     getBudgetSummary,
  // );

  return (
    // {data?.budgetItems.map((item) => (
    //     <BudgetItemSummary item={item} isLoading={isLoading} key={item.id}/>
    // ))
    // }
    <></>
  );
}
