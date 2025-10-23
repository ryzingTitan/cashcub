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
import { useToggle } from "usehooks-ts";
import { useSWRConfig } from "swr";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { budgetItemValidationSchema } from "@/types/validations";
import { deleteBudgetItem, updateBudgetItem } from "@/lib/budgets";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";

interface BudgetItemProps {
  budgetItem: BudgetItem;
  categoryName: string;
}

export default function BudgetItemSummary({
  budgetItem,
  categoryName,
}: BudgetItemProps) {
  const [value, toggle] = useToggle(false);
  const { mutate } = useSWRConfig();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      plannedAmount: budgetItem.plannedAmount,
      name: budgetItem.name,
    },
    validationSchema: budgetItemValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const updatedBudgetItem: BudgetItem = {
          id: null,
          plannedAmount: values.plannedAmount,
          actualAmount: null,
          name: values.name,
          budgetId: null,
          categoryId: budgetItem.categoryId,
        };
        await updateBudgetItem(
          `/budgets/${budgetItem.budgetId}/items/${budgetItem.id}`,
          updatedBudgetItem,
        );
        await mutate(`/budgets/${budgetItem.budgetId}`);
        enqueueSnackbar("Budget item updated", { variant: "success" });
        toggle();
        resetForm();
      } catch (error) {
        enqueueSnackbar("Failed to update budget item", { variant: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCancel = () => {
    toggle();
    formik.resetForm();
  };

  const handleSave = () => {
    formik.handleSubmit();
  };

  const handleDelete = async () => {
    try {
      await deleteBudgetItem(
        `/budgets/${budgetItem.budgetId}/items/${budgetItem.id}`,
      );
      await mutate(`/budgets/${budgetItem.budgetId}`);
      enqueueSnackbar("Budget item deleted", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to delete budget item", { variant: "error" });
    }
  };

  return (
    <Stack direction="row" alignItems="center">
      <ListItem>
        {value ? (
          <TextField
            required
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{ m: 2 }}
          />
        ) : (
          <Typography>{budgetItem.name}</Typography>
        )}
        <Stack
          direction={"row"}
          spacing={2}
          sx={{ flexGrow: 1 }}
          justifyContent="flex-end"
        >
          {value ? (
            <TextField
              required
              label="Planned Amount"
              name="plannedAmount"
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
              sx={{ m: 2 }}
            />
          ) : (
            <Stack>
              <Typography align={"center"}>Planned</Typography>
              <Typography color={"success"} align={"center"}>
                {formatToCurrency(budgetItem.plannedAmount)}
              </Typography>
            </Stack>
          )}

          <Stack>
            <Typography align={"center"}>Actual</Typography>
            <Typography
              color={categoryName === "Income" ? "success" : "error"}
              align={"center"}
            >
              {formatToCurrency(budgetItem.actualAmount!)}
            </Typography>
          </Stack>

          <Stack>
            <Typography>Remaining</Typography>
            <Typography
              color={
                budgetItem.plannedAmount - budgetItem.actualAmount! >= 0
                  ? "success"
                  : "error"
              }
              align={"center"}
            >
              {formatToCurrency(
                budgetItem.plannedAmount - budgetItem.actualAmount!,
              )}
            </Typography>
          </Stack>
        </Stack>
      </ListItem>
      {value ? (
        <>
          <Tooltip title="Save Budget Item">
            <IconButton>
              <SaveIcon onClick={handleSave} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel Edit">
            <IconButton>
              <CancelIcon onClick={handleCancel} />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          <Tooltip title="Edit Budget Item">
            <IconButton>
              <EditIcon onClick={toggle} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Budget Item">
            <IconButton>
              <DeleteIcon onClick={handleDelete} />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Stack>
  );
}
