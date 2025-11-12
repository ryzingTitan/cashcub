"use server";

import { Transaction } from "@/types/api";
import { redirect } from "next/navigation";
import { auth0, loginUrl } from "@/lib/auth0";

const baseUrl = process.env.API_BASE_URL;

export async function getAllTransactions(url: string): Promise<Transaction[]> {
  const session = await auth0.getSession();

  if (!session) {
    redirect(loginUrl);
  }

  const response = await fetch(baseUrl + url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokenSet.idToken}`,
    },
  });

  if (!response.ok) {
    console.error(
      `Failed to fetch transactions with status: ${response.status}`,
    );
    return Promise.reject("Failed to fetch transactions");
  }
  return response.json();
}

export async function createTransaction(
  url: string,
  transaction: Partial<Transaction>,
): Promise<Transaction> {
  const session = await auth0.getSession();

  if (!session) {
    redirect(loginUrl);
  }

  const response = await fetch(baseUrl + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokenSet.idToken}`,
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    console.error(
      `Failed to create transaction with status: ${response.status}`,
    );
    return Promise.reject("Failed to create transaction");
  }
  return response.json();
}

export async function updateTransaction(
  url: string,
  id: string,
  patch: Partial<Transaction>,
): Promise<Transaction> {
  const session = await auth0.getSession();

  if (!session) {
    redirect(loginUrl);
  }

  const response = await fetch(`${baseUrl}${url}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokenSet.idToken}`,
    },
    body: JSON.stringify(patch),
  });

  if (!response.ok) {
    console.error(
      `Failed to update transaction with status: ${response.status}`,
    );
    return Promise.reject("Failed to update transaction");
  }
  return response.json();
}

export async function deleteTransaction(
  url: string,
  id: string,
): Promise<void> {
  const session = await auth0.getSession();

  if (!session) {
    redirect(loginUrl);
  }

  const response = await fetch(`${baseUrl}${url}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokenSet.idToken}`,
    },
  });

  if (!response.ok) {
    console.error(
      `Failed to delete transaction with status: ${response.status}`,
    );
    return Promise.reject("Failed to delete transaction");
  }
}
