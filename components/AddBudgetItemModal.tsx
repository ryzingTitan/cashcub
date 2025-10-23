import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { useToggle } from "usehooks-ts";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import { useSWRConfig } from "swr";
import { createBudgetItem } from "@/lib/budgets";
import { BudgetItem } from "@/types/api";
import { useSnackbar } from "notistack";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import * as yup from "yup";
import { useFormik } from "formik";

interface AddBudgetItemModalProps {
  budgetId?: string | undefined;
  categoryId?: string;
}

export default function AddBudgetItemModal({
  budgetId,
  categoryId,
}: AddBudgetItemModalProps) {
  const [value, toggle] = useToggle(false);
  const { mutate } = useSWRConfig();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();

  const validationSchema = yup.object({
    plannedAmount: yup
      .number()
      .moreThan(0, "Planned amount must be greater than 0")
      .required("Planned amount is required"),
    name: yup.string().required("Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      plannedAmount: 1,
      name: "New Budget Item",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const newBudgetItem: BudgetItem = {
          id: null,
          plannedAmount: values.plannedAmount,
          actualAmount: 0,
          name: values.name,
          budgetId: budgetId!,
          categoryId: categoryId!,
        };
        await createBudgetItem(`/budgets/${params.slug}/items`, newBudgetItem);
        await mutate(`/budgets/${params.slug}`);
        enqueueSnackbar("Budget item created", { variant: "success" });
        toggle();
      } catch (error) {
        enqueueSnackbar("Failed to create budget item", { variant: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Tooltip title="Add Budget Item">
        <IconButton>
          <AddIcon onClick={toggle} fontSize={"small"} />
        </IconButton>
      </Tooltip>
      <Dialog open={value} onClose={toggle}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <DialogTitle>Add Budget Item</DialogTitle>
          <DialogContent>
            <Stack>
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
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggle}>Cancel</Button>
            <Button type={"submit"} disabled={!formik.isValid} autoFocus>
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
