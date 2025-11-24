"use client";

import {
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { useSWRConfig } from "swr";
import { Transaction } from "@/types/api";
import { fetchWithAuth } from "@/lib/api";
import { useApi } from "./useApi";

export const useTransactions = (budgetId: string, budgetItemId: string) => {
  const swrKey = `/api/budgets/${budgetId}/items/${budgetItemId}/transactions`;
  const {
    data = [],
    isLoading,
    mutate: revalidate,
  } = useApi<Transaction[]>(swrKey);
  const { mutate } = useSWRConfig();
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

      if (String(id).startsWith("new-")) {
        mutate(
          swrKey,
          (currentData: Transaction[] | undefined) =>
            currentData?.filter((row) => row.id !== id),
          false,
        );
      }
    },
    [rowModesModel, mutate, swrKey],
  );

  const handleDeleteClick = useCallback(
    (id: GridRowId) => async () => {
      const optimisticData = data.filter((r) => r.id !== id);
      try {
        await mutate(
          swrKey,
          fetchWithAuth(`${swrKey}/${id}`, { method: "DELETE" }),
          {
            optimisticData,
            revalidate: false,
          },
        );
        enqueueSnackbar("Transaction deleted", { variant: "success" });
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
      _oldRow: GridValidRowModel,
    ): Promise<GridValidRowModel> => {
      const payload: Partial<Transaction> = {
        ...newRow,
        budgetId,
        budgetItemId,
      };

      try {
        if (String(newRow.id).startsWith("new-")) {
          await fetchWithAuth(swrKey, {
            method: "POST",
            body: payload,
          });
          enqueueSnackbar("Transaction created", { variant: "success" });
        } else {
          await fetchWithAuth(`${swrKey}/${newRow.id}`, {
            method: "PUT",
            body: payload,
          });
          enqueueSnackbar("Transaction updated", { variant: "success" });
        }
        revalidate();
        return newRow;
      } catch (e) {
        console.error(e);
        enqueueSnackbar("Failed to save transaction", { variant: "error" });
        throw e;
      }
    },
    [swrKey, revalidate, enqueueSnackbar, budgetId, budgetItemId],
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
      isNew: true,
    };

    mutate(swrKey, (currentData: any) => [newRow, ...currentData], false);
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "date" },
    }));
  }, [mutate, swrKey, budgetId, budgetItemId]);

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
