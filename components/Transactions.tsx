"use client";

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
  GridColDef,
  GridActionsCellItem,
  GridRowModes,
  GridEventListener,
  GridRowEditStopReasons,
  useGridApiContext,
  GridRenderEditCellParams,
  ToolbarButton,
  Toolbar,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import { formatToCurrency } from "@/lib/utils";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";

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

interface TransactionsProps {
  budgetId: string;
  budgetItemId: string;
}

export default function Transactions({
  budgetId,
  budgetItemId,
}: TransactionsProps) {
  const [value, toggle] = useToggle(false);
  const {
    rows,
    isLoading,
    rowModesModel,
    handleRowModesModelChange,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleDeleteClick,
    processRowUpdate,
    handleAddNew,
  } = useTransactions(budgetId, budgetItemId);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

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
        headerAlign: "center",
        align: "center",
      },
      {
        field: "amount",
        headerName: "Amount",
        headerAlign: "center",
        align: "center",
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
        headerAlign: "center",
        align: "center",
        editable: true,
        type: "singleSelect",
        valueOptions: ["EXPENSE", "INCOME"],
      },
      {
        field: "merchant",
        headerName: "Merchant",
        headerAlign: "center",
        align: "center",
        editable: true,
      },
      {
        field: "notes",
        headerName: "Notes",
        headerAlign: "center",
        align: "center",
        editable: true,
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        headerAlign: "center",
        align: "center",
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

  return (
    <>
      <Tooltip title="View Transactions">
        <IconButton onClick={toggle}>
          <ReceiptIcon />
        </IconButton>
      </Tooltip>
      <Dialog onClose={toggle} open={value} fullWidth={true} maxWidth={"xl"}>
        <DialogTitle>Transactions</DialogTitle>
        <DialogContent>
          <DataGrid
            rows={rows || []}
            columns={columns}
            loading={isLoading}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{
              toolbar: () => (
                <Toolbar>
                  <Tooltip title="Add transaction">
                    <ToolbarButton onClick={handleAddNew} size="small">
                      <AddIcon />
                    </ToolbarButton>
                  </Tooltip>
                </Toolbar>
              ),
            }}
            autosizeOnMount
            showToolbar
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
