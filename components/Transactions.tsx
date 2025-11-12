import { useToggle } from "usehooks-ts";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridActionsCellItem,
  GridRowModesModel,
  GridRowModes,
  GridRowId,
  GridRowModel,
  GridEventListener,
  GridRowEditStopReasons,
  Toolbar,
  useGridApiContext,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";
import useSWR from "swr";
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/lib/transactions";
import dayjs from "dayjs";
import { formatToCurrency } from "@/lib/utils";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Transaction } from "@/types/api";
import { useSnackbar } from "notistack";

interface TransactionsProps {
  budgetId: string;
  budgetItemId: string;
}

export default function Transactions({
  budgetId,
  budgetItemId,
}: TransactionsProps) {
  const [value, toggle] = useToggle(false);
  const swrKey = `/budgets/${budgetId}/items/${budgetItemId}/transactions`;
  const { data, isLoading, mutate } = useSWR(swrKey, getAllTransactions);
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setRows(data || []);
  }, [data]);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel, oldRow: GridRowModel) => {
      // Normalize fields
      const payload: Partial<Transaction> = {
        ...newRow,
        budgetId,
        budgetItemId,
      };

      try {
        let updated: Transaction;
        if (!oldRow.id || String(oldRow.id).startsWith("new-")) {
          // create
          updated = await createTransaction(swrKey, payload);
          enqueueSnackbar("Transaction created", { variant: "success" });
        } else {
          updated = await updateTransaction(swrKey, String(oldRow.id), payload);
          enqueueSnackbar("Transaction updated", { variant: "success" });
        }

        setRows((prev) => prev.map((r) => (r.id === oldRow.id ? updated : r)));
        // refresh cache in background
        void mutate();
        return updated;
      } catch (e) {
        console.error(e);
        enqueueSnackbar("Failed to save transaction", { variant: "error" });
        throw e;
      }
    },
    [budgetId, budgetItemId, swrKey, mutate, enqueueSnackbar],
  );

  const handleEditClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    },
    [rowModesModel],
  );

  const handleSaveClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    },
    [rowModesModel],
  );

  const handleCancelClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
      // If it's a newly added row, remove it on cancel
      if (String(id).startsWith("new-")) {
        setRows((prev) => prev.filter((r) => r.id !== id));
      }
    },
    [rowModesModel],
  );

  const handleDeleteClick = useCallback(
    (id: GridRowId) => async () => {
      // Optimistic remove
      const toRemove = rows.find((r) => r.id === id);
      setRows((prev) => prev.filter((r) => r.id !== id));
      try {
        if (
          toRemove &&
          toRemove.id &&
          !String(toRemove.id).startsWith("new-")
        ) {
          await deleteTransaction(swrKey, String(toRemove.id));
        }
        void mutate();
        enqueueSnackbar("Transaction deleted", { variant: "success" });
      } catch (e) {
        // revert on failure
        setRows((prev) => [...prev, toRemove!]);
        console.error(e);
        enqueueSnackbar("Failed to delete transaction", { variant: "error" });
      }
    },
    [rows, swrKey, mutate, enqueueSnackbar],
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "date",
        headerName: "Date",
        valueFormatter: (value?: string) => {
          if (value == null) {
            return "";
          }
          return `${dayjs(value).format("MMM DD")}`;
        },
        editable: true,
        type: "date",
      },
      {
        field: "amount",
        headerName: "Amount",
        valueFormatter: (value?: number) => {
          if (value == null) {
            return "";
          }
          return `${formatToCurrency(value)}`;
        },
        editable: true,
        renderEditCell: (params) => <AmountEditCell {...params} />,
      },
      {
        field: "transactionType",
        headerName: "Type",
        editable: true,
        type: "singleSelect",
        valueOptions: ["EXPENSE", "INCOME"],
      },
      { field: "merchant", headerName: "Merchant", editable: true },
      { field: "notes", headerName: "Notes", editable: true },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                key="save"
                icon={<SaveIcon />}
                label="Save"
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                key="cancel"
                icon={<CancelIcon />}
                label="Cancel"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }
          return [
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon />}
              label="Edit"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              key="delete"
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        },
      },
    ],
    [
      handleCancelClick,
      handleDeleteClick,
      handleEditClick,
      handleSaveClick,
      rowModesModel,
    ],
  );

  function EditToolbar() {
    const handleClick = () => {
      const id = `new-${Date.now()}`;
      const newRow: GridRowModel = {
        id,
        date: dayjs().toISOString(),
        amount: 0,
        transactionType: "EXPENSE",
        merchant: "",
        notes: "",
        budgetId,
        budgetItemId,
      };
      setRows((prev) => [newRow, ...prev]);
      setRowModesModel((prev) => ({
        ...prev,
        [id]: { mode: GridRowModes.Edit },
      }));
    };
    return (
      <Toolbar>
        <Tooltip title="Add transaction">
          <IconButton onClick={handleClick} size="small">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    );
  }

  const AmountEditCell = (props: GridRenderEditCellParams) => {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value; // The new value entered by the user
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    };

    return (
      <TextField
        autoFocus
        size="small"
        value={value}
        onChange={handleValueChange}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          },
        }}
      />
    );
  };

  return (
    <>
      <Tooltip title="View Transactions">
        <IconButton>
          <ReceiptIcon onClick={toggle} />
        </IconButton>
      </Tooltip>
      <Dialog onClose={toggle} open={value} fullWidth={true} maxWidth={"xl"}>
        <DialogTitle>Transactions</DialogTitle>
        <DialogContent>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isLoading}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={setRowModesModel}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{ toolbar: EditToolbar }}
            slotProps={{ toolbar: {} }}
            showToolbar
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
