import {
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import useSWR from "swr";
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  updateTransaction,
} from "@/lib/transactions";
import { Transaction } from "@/types/api";

export const useTransactions = (budgetId: string, budgetItemId: string) => {
  const swrKey = `/budgets/${budgetId}/items/${budgetItemId}/transactions`;
  const { data, isLoading, mutate } = useSWR<Transaction[]>(
    swrKey,
    getAllTransactions,
  );
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const { enqueueSnackbar } = useSnackbar();

  const handleRowModesModelChange = (newModel: GridRowModesModel) => {
    setRowModesModel(newModel);
  };

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

      // If the row is a new row, remove it from the cache
      if (String(id).startsWith("new-")) {
        mutate(
          (currentData) => currentData?.filter((row) => row.id !== id),
          false,
        );
      }
    },
    [rowModesModel, mutate],
  );

  const handleDeleteClick = useCallback(
    (id: GridRowId) => async () => {
      if (!data) return;
      const toRemove = data.find((r) => r.id === id);
      const optimisticData = data.filter((r) => r.id !== id);

      try {
        if (toRemove && !String(toRemove.id).startsWith("new-")) {
          mutate(optimisticData, false);
          deleteTransaction(swrKey, String(toRemove.id));
          enqueueSnackbar("Transaction deleted", { variant: "success" });
        }
      } catch (e) {
        console.error(e);
        enqueueSnackbar("Failed to delete transaction", { variant: "error" });
      }
    },
    [data, swrKey, mutate, enqueueSnackbar],
  );

  const processRowUpdate = useCallback(
    async (
      newRow: GridValidRowModel,
      oldRow: GridValidRowModel,
    ): Promise<GridValidRowModel> => {
      const payload: Partial<Transaction> = {
        ...newRow,
        budgetId,
        budgetItemId,
      };

      try {
        if (String(newRow.id).startsWith("new-")) {
          // Create
          const created = await createTransaction(swrKey, payload);
          mutate(
            (currentData) => [created, ...(currentData || [])],
            false,
          );
          enqueueSnackbar("Transaction created", { variant: "success" });
        } else {
          // Update
          const updated = await updateTransaction(
            swrKey,
            String(oldRow.id),
            payload,
          );
          mutate(
            (currentData) =>
              currentData?.map((r) => (r.id === updated.id ? updated : r)),
            false,
          );
          enqueueSnackbar("Transaction updated", { variant: "success" });
        }
        return newRow;
      } catch (e) {
        console.error(e);
        enqueueSnackbar("Failed to save transaction", { variant: "error" });
        throw e;
      }
    },
    [data, swrKey, mutate, enqueueSnackbar, budgetId, budgetItemId],
  );

  const handleAddNew = useCallback(() => {
    const id = `new-${Date.now()}`;
    const newRow = {
      id,
      date: new Date().toISOString(),
      amount: 0,
      transactionType: "EXPENSE",
      merchant: "",
      notes: "",
      budgetId,
      budgetItemId,
    };

    // Use mutate to add to the local cache without revalidating
    mutate([newRow as Transaction, ...(data || [])], false);

    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "date" },
    }));
  }, [data, mutate, budgetId, budgetItemId]);

  return {
    rows: data,
    isLoading,
    rowModesModel,
    handleRowModesModelChange,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleDeleteClick,
    processRowUpdate,
    handleAddNew,
  };
};
