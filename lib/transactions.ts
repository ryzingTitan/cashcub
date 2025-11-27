"use server";

import { Transaction } from "@/types/api";
import { fetchWithAuth } from "./api";
import { auth0, ensureValidSession } from "./auth0";

const handleTransactionError = (error: unknown, message: string) => {
  console.error(`${message}:`, error);
  return Promise.reject(message);
};

export async function getAllTransactions(url: string): Promise<Transaction[]> {
  const session = await auth0.getSession();
  ensureValidSession(session); // Redirect happens here if session invalid

  try {
    return await fetchWithAuth<Transaction[]>(url);
  } catch (error) {
    return handleTransactionError(error, "Failed to fetch transactions");
  }
}

export async function createTransaction(
  url: string,
  transaction: Partial<Transaction>,
): Promise<Transaction> {
  const session = await auth0.getSession();
  ensureValidSession(session); // Redirect happens here if session invalid

  try {
    return await fetchWithAuth<Transaction>(url, {
      method: "POST",
      body: transaction,
    });
  } catch (error) {
    return handleTransactionError(error, "Failed to create transaction");
  }
}

export async function updateTransaction(
  url: string,
  id: string,
  patch: Partial<Transaction>,
): Promise<Transaction> {
  const session = await auth0.getSession();
  ensureValidSession(session); // Redirect happens here if session invalid

  try {
    return await fetchWithAuth<Transaction>(`${url}/${id}`, {
      method: "PUT",
      body: patch,
    });
  } catch (error) {
    return handleTransactionError(error, "Failed to update transaction");
  }
}

export async function deleteTransaction(
  url: string,
  id: string,
): Promise<void> {
  const session = await auth0.getSession();
  ensureValidSession(session); // Redirect happens here if session invalid

  try {
    await fetchWithAuth<void>(`${url}/${id}`, { method: "DELETE" });
  } catch (error) {
    return handleTransactionError(error, "Failed to delete transaction");
  }
}
