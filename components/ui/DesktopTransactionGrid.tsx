"use client";

import { useMemo } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
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
  GridRowModesModel,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import { formatToCurrency } from "@/lib/utils";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import type { TransactionRow } from "./MobileTransactionList";

const AmountEditCell = (props: GridRenderEditCellParams) => {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
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

interface DesktopTransactionGridProps {
  rows: TransactionRow[] | undefined;
  isLoading: boolean;
  rowModesModel: GridRowModesModel;
  onRowModesModelChange: (model: GridRowModesModel) => void;
  onEditClick: (id: string | number) => () => void;
  onSaveClick: (id: string | number) => () => void;
  onCancelClick: (id: string | number) => () => void;
  onDeleteClick: (id: string | number) => () => void;
  processRowUpdate: (
    newRow: TransactionRow,
    oldRow: TransactionRow,
  ) => Promise<TransactionRow>;
  onAddNew: () => void;
}

export default function DesktopTransactionGrid({
  rows,
  isLoading,
  rowModesModel,
  onRowModesModelChange,
  onEditClick,
  onSaveClick,
  onCancelClick,
  onDeleteClick,
  processRowUpdate,
  onAddNew,
}: DesktopTransactionGridProps) {
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
        flex: 1,
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
        flex: 1,
        renderEditCell: (params) => <AmountEditCell {...params} />,
      },
      {
        field: "transactionType",
        headerName: "Type",
        headerAlign: "center",
        align: "center",
        editable: true,
        type: "singleSelect",
        flex: 1,
        valueOptions: ["EXPENSE", "INCOME"],
      },
      {
        field: "merchant",
        headerName: "Merchant",
        headerAlign: "center",
        align: "center",
        editable: true,
        flex: 1,
      },
      {
        field: "notes",
        headerName: "Notes",
        headerAlign: "center",
        align: "center",
        editable: true,
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        headerAlign: "center",
        align: "center",
        flex: 1,
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                key="save"
                icon={<SaveIcon />}
                label="Save"
                onClick={onSaveClick(id)}
              />,
              <GridActionsCellItem
                key="cancel"
                icon={<CancelIcon />}
                label="Cancel"
                onClick={onCancelClick(id)}
                color="inherit"
              />,
            ];
          }
          return [
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon />}
              label="Edit"
              onClick={onEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              key="delete"
              icon={<DeleteIcon />}
              label="Delete"
              onClick={onDeleteClick(id)}
              color="inherit"
            />,
          ];
        },
      },
    ],
    [onCancelClick, onDeleteClick, onEditClick, onSaveClick, rowModesModel],
  );

  return (
    <DataGrid
      rows={rows || []}
      columns={columns}
      loading={isLoading}
      editMode="row"
      rowModesModel={rowModesModel}
      onRowModesModelChange={onRowModesModelChange}
      onRowEditStop={handleRowEditStop}
      processRowUpdate={processRowUpdate}
      initialState={{
        sorting: {
          sortModel: [{ field: "date", sort: "desc" }],
        },
      }}
      slots={{
        toolbar: () => (
          <Toolbar>
            <Tooltip title="Add transaction">
              <ToolbarButton onClick={onAddNew} size="small">
                <AddIcon />
              </ToolbarButton>
            </Tooltip>
          </Toolbar>
        ),
      }}
      showToolbar
    />
  );
}
