"use client";

import { useState } from "react";
import { useToggle } from "usehooks-ts";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTransactions } from "@/hooks/ui/useTransactions";
import MobileTransactionList, {
  type TransactionRow,
} from "./MobileTransactionList";
import DesktopTransactionGrid from "./DesktopTransactionGrid";

interface TransactionsProps {
  budgetId: string;
  budgetItemId: string;
}

export default function Transactions({
  budgetId,
  budgetItemId,
}: TransactionsProps) {
  const [value, toggle] = useToggle(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [editingMobileId, setEditingMobileId] = useState<
    string | number | null
  >(null);
  const [mobileEditData, setMobileEditData] = useState<Partial<TransactionRow>>(
    {},
  );

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

  // Mobile handlers
  const handleMobileEdit = (id: string | number) => {
    setEditingMobileId(id);
    const transaction = rows?.find((row) => row.id === id);
    if (transaction) {
      setMobileEditData(transaction);
    }
  };

  const handleMobileSave = async (id: string | number) => {
    const updatedRow = {
      ...rows?.find((row) => row.id === id),
      ...mobileEditData,
    };
    await processRowUpdate(
      updatedRow as TransactionRow,
      rows?.find((row) => row.id === id) as TransactionRow,
    );
    setEditingMobileId(null);
    setMobileEditData({});
  };

  const handleMobileCancel = () => {
    setEditingMobileId(null);
    setMobileEditData({});
  };

  const handleMobileUpdate = (
    id: string | number,
    field: string,
    value: string | number,
  ) => {
    setMobileEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMobileDelete = (id: string | number) => {
    handleDeleteClick(id)();
  };

  const handleProcessRowUpdate = async (
    newRow: TransactionRow,
    oldRow: TransactionRow,
  ): Promise<TransactionRow> => {
    return processRowUpdate(newRow, oldRow) as Promise<TransactionRow>;
  };

  return (
    <>
      <Tooltip title="View Transactions">
        <IconButton onClick={toggle}>
          <ReceiptIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        onClose={toggle}
        open={value}
        fullWidth={true}
        maxWidth={isMobile ? "sm" : "xl"}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            Transactions
            <IconButton
              aria-label="close"
              onClick={toggle}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {isMobile ? (
            <MobileTransactionList
              rows={rows as unknown as TransactionRow[]}
              isLoading={isLoading}
              editingId={editingMobileId}
              onEdit={handleMobileEdit}
              onSave={handleMobileSave}
              onCancel={handleMobileCancel}
              onDelete={handleMobileDelete}
              onUpdate={handleMobileUpdate}
              budgetItemId={budgetItemId}
            />
          ) : (
            <DesktopTransactionGrid
              rows={rows as unknown as TransactionRow[]}
              isLoading={isLoading}
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onEditClick={handleEditClick}
              onSaveClick={handleSaveClick}
              onCancelClick={handleCancelClick}
              onDeleteClick={handleDeleteClick}
              processRowUpdate={handleProcessRowUpdate}
              onAddNew={handleAddNew}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
