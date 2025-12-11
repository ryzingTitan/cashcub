"use client";

import { useState } from "react";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { formatToCurrency } from "@/lib/utils";

export interface TransactionRow {
  id: string | number | null;
  date: string;
  amount: number;
  transactionType: "EXPENSE" | "INCOME";
  merchant: string | null;
  notes: string | null;
}

interface MobileTransactionCardProps {
  transaction: TransactionRow;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  isEditing: boolean;
  onUpdate: (field: string, value: string | number) => void;
}

const MobileTransactionCard = ({
  transaction,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  isEditing,
  onUpdate,
}: MobileTransactionCardProps) => {
  const [editValues, setEditValues] = useState({
    date: transaction.date,
    amount: transaction.amount.toString(),
    transactionType: transaction.transactionType,
    merchant: transaction.merchant ?? "",
    notes: transaction.notes ?? "",
  });

  const handleLocalUpdate = (field: string, value: string) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
    onUpdate(field, field === "amount" ? parseFloat(value) || 0 : value);
  };

  const handleSave = () => {
    onSave();
  };

  if (isEditing) {
    return (
      <Card sx={{ mb: 2, border: 2, borderColor: "primary.main" }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Date"
              type="date"
              fullWidth
              size="small"
              value={dayjs(editValues.date).format("YYYY-MM-DD")}
              onChange={(e) => handleLocalUpdate("date", e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
            <TextField
              label="Amount"
              type="number"
              fullWidth
              size="small"
              value={editValues.amount}
              onChange={(e) => handleLocalUpdate("amount", e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
            />
            <FormControl fullWidth size="small">
              <Select
                value={editValues.transactionType}
                onChange={(e) =>
                  handleLocalUpdate("transactionType", e.target.value)
                }
              >
                <MenuItem value="EXPENSE">EXPENSE</MenuItem>
                <MenuItem value="INCOME">INCOME</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Merchant"
              fullWidth
              size="small"
              value={editValues.merchant}
              onChange={(e) => handleLocalUpdate("merchant", e.target.value)}
            />
            <TextField
              label="Notes"
              fullWidth
              size="small"
              multiline
              rows={2}
              value={editValues.notes}
              onChange={(e) => handleLocalUpdate("notes", e.target.value)}
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button size="small" onClick={onCancel}>
                Cancel
              </Button>
              <Button size="small" onClick={handleSave}>
                Save
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" component="div">
              {formatToCurrency(transaction.amount)}
            </Typography>
            <Chip
              label={transaction.transactionType}
              color={
                transaction.transactionType === "INCOME" ? "success" : "error"
              }
              size="small"
            />
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary">
              {dayjs(transaction.date).format("MMM DD, YYYY")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {transaction.merchant ?? ""}
            </Typography>
          </Stack>
          {transaction.notes && (
            <Typography variant="body2" color="text.secondary">
              {transaction.notes}
            </Typography>
          )}
          <Stack direction="row" spacing={1} justifyContent="flex-end" mt={1}>
            <IconButton size="small" onClick={onEdit}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

interface MobileTransactionListProps {
  rows: TransactionRow[] | undefined;
  isLoading: boolean;
  editingId: string | number | null;
  onEdit: (id: string | number) => void;
  onSave: (id: string | number) => void;
  onCancel: () => void;
  onDelete: (id: string | number) => void;
  onUpdate: (
    id: string | number,
    field: string,
    value: string | number,
  ) => void;
  onAddNew: () => void;
}

export default function MobileTransactionList({
  rows,
  isLoading,
  editingId,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onUpdate,
  onAddNew,
}: MobileTransactionListProps) {
  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddNew}
          size="small"
        >
          Add Transaction
        </Button>
      </Box>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : rows && rows.length > 0 ? (
        <Stack spacing={2}>
          {[...rows]
            .filter((transaction) => transaction.id !== null)
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .map((transaction) => (
              <MobileTransactionCard
                key={transaction.id}
                transaction={transaction}
                isEditing={editingId === transaction.id}
                onEdit={() => onEdit(transaction.id!)}
                onSave={() => onSave(transaction.id!)}
                onCancel={onCancel}
                onDelete={() => onDelete(transaction.id!)}
                onUpdate={(field, value) =>
                  onUpdate(transaction.id!, field, value)
                }
              />
            ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary" align="center">
          No transactions found
        </Typography>
      )}
    </Box>
  );
}
