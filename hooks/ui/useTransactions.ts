import {
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
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
  const [rows, setRows] = useState<readonly Transaction[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (data) {
      setRows((currentRows) => {
        const newRows = currentRows.filter((r) =>
          String(r.id).startsWith("new-"),
        );
        const serverRows = data;
        const serverRowIds = new Set(serverRows.map((r) => r.id));
        const uniqueNewRows = newRows.filter((r) => !serverRowIds.has(r.id));
        return [...uniqueNewRows, ...serverRows];
      });
    }
  }, [data]);

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
        setRows((currentRows) => currentRows.filter((row) => row.id !== id));
      }
    },
    [rowModesModel],
  );

  const handleDeleteClick = useCallback(
    (id: GridRowId) => async () => {
      const originalRows = [...rows];
      const newRows = rows.filter((row) => row.id !== id);
      setRows(newRows);

      if (String(id).startsWith("new-")) {
        return;
      }

      try {
        await deleteTransaction(swrKey, String(id));
        mutate(
          newRows.filter((r) => !String(r.id).startsWith("new-")),
          false,
        );
        enqueueSnackbar("Transaction deleted", { variant: "success" });
      } catch (e) {
        console.error(e);
        setRows(originalRows);
        enqueueSnackbar("Failed to delete transaction", { variant: "error" });
      }
    },
    [rows, swrKey, mutate, enqueueSnackbar],
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
          setRows((currentRows) =>
            currentRows.map((row) => (row.id === newRow.id ? created : row)),
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
          setRows((currentRows) =>
            currentRows.map((row) => (row.id === updated.id ? updated : row)),
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

    setRows((oldRows) => [newRow, ...oldRows]);
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
