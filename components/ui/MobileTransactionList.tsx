"use client";

import { useState, useMemo, memo } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import AddTransactionDialog from "./AddTransactionDialog";
import { TransactionCardSkeleton } from "@/components/ui/skeletons";
import MobileTransactionCard, {
  type TransactionRow,
} from "./MobileTransactionCard";

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
  budgetItemId?: string;
}

function MobileTransactionList({
  rows,
  isLoading,
  editingId,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onUpdate,
  budgetItemId,
}: MobileTransactionListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  // Sort transactions once and memoize
  const sortedRows = useMemo(() => {
    if (!rows) return [];
    return [...rows]
      .filter((transaction) => transaction.id !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [rows]);

  // Only show subset of transactions
  const visibleRows = sortedRows.slice(0, visibleCount);
  const hasMore = visibleCount < sortedRows.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          size="small"
        >
          Add Transaction
        </Button>
      </Box>
      {isLoading ? (
        <Stack spacing={2} data-testid="transaction-list-skeleton">
          {[1, 2, 3, 4, 5].map((i) => (
            <TransactionCardSkeleton
              key={i}
              showNotes={i % 3 === 0}
              testId={`transaction-skeleton-${i}`}
            />
          ))}
        </Stack>
      ) : visibleRows.length > 0 ? (
        <>
          <Stack spacing={2}>
            {visibleRows.map((transaction) => (
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

          {hasMore && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button onClick={handleLoadMore} variant="outlined">
                Load More ({sortedRows.length - visibleCount} remaining)
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Typography variant="body2" color="text.secondary" align="center">
          No transactions found
        </Typography>
      )}
      <AddTransactionDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        budgetItemId={budgetItemId}
      />
    </Box>
  );
}

export default memo(MobileTransactionList);
