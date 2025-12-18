"use client";

import { useState, memo } from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers";
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

const MobileTransactionCard = memo(
  ({
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
              <DatePicker
                label="Date"
                value={dayjs(editValues.date)}
                onChange={(newValue) =>
                  handleLocalUpdate(
                    "date",
                    newValue ? newValue.toISOString() : editValues.date,
                  )
                }
                slotProps={{
                  textField: { size: "small", fullWidth: true },
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
              <IconButton size="small" onClick={onEdit} aria-label="Edit">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={onDelete} aria-label="Delete">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  },
);

MobileTransactionCard.displayName = "MobileTransactionCard";

export default MobileTransactionCard;
