import { BudgetItem } from "@/types/api";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { formatToCurrency } from "@/lib/utils";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import Transactions from "@/components/Transactions";
import InputAdornment from "@mui/material/InputAdornment";
import { useBudgetItemSummary } from "@/hooks/useBudgetItemSummary";
import { FormikProps } from "formik";

interface BudgetItemProps {
  budgetItem: BudgetItem;
  categoryName: string;
}

interface EditViewProps {
  formik: FormikProps<{
    plannedAmount: number;
    name: string;
  }>;
  handleCancel: () => void;
}

interface ReadOnlyViewProps {
  budgetItem: BudgetItem;
  categoryName: string;
  onEdit: () => void;
  onDelete: () => void;
}

function EditView({ formik, handleCancel }: EditViewProps) {
  return (
    <>
      <ListItem sx={{ flexDirection: { xs: "column", sm: "row" } }}>
        <TextField
          required
          label="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          sx={{ m: 2, width: { xs: "100%", sm: "auto" } }}
        />
        <Stack
          direction={"row"}
          spacing={2}
          sx={{
            flexGrow: 1,
            justifyContent: { xs: "center", sm: "flex-end" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <TextField
            required
            label="Planned Amount"
            name="plannedAmount"
            type="number"
            value={formik.values.plannedAmount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.plannedAmount &&
              Boolean(formik.errors.plannedAmount)
            }
            helperText={
              formik.touched.plannedAmount && formik.errors.plannedAmount
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            sx={{ m: 2, width: { xs: "100%", sm: "auto" } }}
          />
        </Stack>
      </ListItem>
      <Tooltip title="Save Budget Item">
        <IconButton onClick={() => formik.handleSubmit()}>
          <SaveIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Cancel Edit">
        <IconButton onClick={handleCancel}>
          <CancelIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}

function ReadOnlyView({
  budgetItem,
  categoryName,
  onEdit,
  onDelete,
}: ReadOnlyViewProps) {
  const remainingAmount = budgetItem.plannedAmount - budgetItem.actualAmount!;

  return (
    <>
      <ListItem sx={{ flexDirection: { xs: "column", sm: "row" } }}>
        <Typography sx={{ mb: { xs: 2, sm: 0 } }}>{budgetItem.name}</Typography>
        <Stack
          direction={"row"}
          spacing={2}
          sx={{ flexGrow: 1, justifyContent: { xs: "center", sm: "flex-end" } }}
        >
          <Stack>
            <Typography align={"center"}>Planned</Typography>
            <Typography
              data-testid="planned-amount"
              color={"success.main"}
              align={"center"}
            >
              {formatToCurrency(budgetItem.plannedAmount)}
            </Typography>
          </Stack>

          <Stack>
            <Typography align={"center"}>Actual</Typography>
            <Typography
              data-testid="actual-amount"
              color={categoryName === "Income" ? "success.main" : "error.main"}
              align={"center"}
            >
              {formatToCurrency(budgetItem.actualAmount!)}
            </Typography>
          </Stack>

          <Stack>
            <Typography align={"center"}>Remaining</Typography>
            <Typography
              data-testid="remaining-amount"
              color={remainingAmount >= 0 ? "success.main" : "error.main"}
              align={"center"}
            >
              {formatToCurrency(remainingAmount)}
            </Typography>
          </Stack>
        </Stack>
      </ListItem>
      <Transactions
        budgetId={budgetItem.budgetId!}
        budgetItemId={budgetItem.id!}
      />
      <Tooltip title="Edit Budget Item">
        <IconButton onClick={onEdit}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Budget Item">
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}

export default function BudgetItemSummary({
  budgetItem,
  categoryName,
}: BudgetItemProps) {
  const { isEditing, formik, toggle, handleCancel, handleDelete } =
    useBudgetItemSummary(budgetItem);

  return (
    <Stack direction="row" alignItems="center">
      {isEditing ? (
        <EditView formik={formik} handleCancel={handleCancel} />
      ) : (
        <ReadOnlyView
          budgetItem={budgetItem}
          categoryName={categoryName}
          onEdit={toggle}
          onDelete={handleDelete}
        />
      )}
    </Stack>
  );
}
