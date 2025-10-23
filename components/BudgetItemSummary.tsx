import { BudgetItem } from "@/types/api";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { formatToCurrency } from "@/lib/utils";

interface BudgetItemProps {
  budgetItem: BudgetItem;
  categoryName: string;
}

export default function BudgetItemSummary({
  budgetItem,
  categoryName,
}: BudgetItemProps) {
  return (
    <ListItem>
      <ListItemButton>
        <Typography>{budgetItem.name}</Typography>
        <Stack
          direction={"row"}
          spacing={2}
          sx={{ flexGrow: 1 }}
          justifyContent="flex-end"
        >
          <Stack>
            <Typography align={"center"}>Planned</Typography>
            <Typography color={"success"} align={"center"}>
              {formatToCurrency(budgetItem.plannedAmount)}
            </Typography>
          </Stack>
          <Stack>
            <Typography align={"center"}>Actual</Typography>
            <Typography
              color={categoryName === "Income" ? "success" : "error"}
              align={"center"}
            >
              {formatToCurrency(budgetItem.actualAmount)}
            </Typography>
          </Stack>

          <Stack>
            <Typography>Remaining</Typography>
            <Typography
              color={
                budgetItem.plannedAmount - budgetItem.actualAmount >= 0
                  ? "success"
                  : "error"
              }
              align={"center"}
            >
              {formatToCurrency(
                budgetItem.plannedAmount - budgetItem.actualAmount,
              )}
            </Typography>
          </Stack>
        </Stack>
      </ListItemButton>
    </ListItem>
  );
}
