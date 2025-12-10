import {
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useCallback, useMemo, useState } from "react";
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
  const [newRows, setNewRows] = useState<readonly Transaction[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const { enqueueSnackbar } = useSnackbar();

  const rows = useMemo(() => {
    if (!data) return newRows;
    const serverRowIds = new Set(data.map((r) => r.id));
    const uniqueNewRows = newRows.filter((r) => !serverRowIds.has(r.id));
    return [...uniqueNewRows, ...data];
  }, [data, newRows]);

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

      if (String(id).startsWith("new-")) {
        setNewRows((currentRows) => currentRows.filter((row) => row.id !== id));
      }
    },
    [rowModesModel],
  );

  const handleDeleteClick = useCallback(
    (id: GridRowId) => async () => {
      if (String(id).startsWith("new-")) {
        setNewRows((currentRows) => currentRows.filter((row) => row.id !== id));
        return;
      }

      try {
        await deleteTransaction(swrKey, String(id));
        mutate((currentData) => currentData?.filter((r) => r.id !== id), false);
        enqueueSnackbar("Transaction deleted", { variant: "success" });
      } catch (e) {
        console.error(e);
        enqueueSnackbar("Failed to delete transaction", { variant: "error" });
      }
    },
    [swrKey, mutate, enqueueSnackbar],
  );

  const processRowUpdate = useCallback(
    async (newRow: GridValidRowModel): Promise<GridValidRowModel> => {
      const payload: Partial<Transaction> = {
        ...newRow,
        budgetId,
        budgetItemId,
      };

      try {
        if (String(newRow.id).startsWith("new-")) {
          const created = await createTransaction(swrKey, payload);
          setNewRows((currentRows) =>
            currentRows.filter((row) => row.id !== newRow.id),
          );
          mutate((currentData) => [created, ...(currentData || [])], false);
          enqueueSnackbar("Transaction created", { variant: "success" });
          return created;
        } else {
          const updated = await updateTransaction(
            swrKey,
            String(newRow.id),
            payload,
          );
          mutate(
            (currentData) =>
              currentData?.map((r) => (r.id === updated.id ? updated : r)),
            false,
          );
          enqueueSnackbar("Transaction updated", { variant: "success" });
          return updated;
        }
      } catch (e) {
        console.error(e);
        enqueueSnackbar("Failed to save transaction", { variant: "error" });
        throw e;
      }
    },
    [swrKey, mutate, enqueueSnackbar, budgetId, budgetItemId],
  );

  const handleAddNew = useCallback(() => {
    const id = `new-${Date.now()}`;
    const newRow: Transaction = {
      id,
      date: new Date().toISOString(),
      amount: 0,
      transactionType: "EXPENSE",
      merchant: "",
      notes: "",
      budgetId,
      budgetItemId,
    };

    setNewRows((oldRows) => [newRow, ...oldRows]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "date" },
    }));
  }, [budgetId, budgetItemId]);

  return {
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
  };
};
