"use server";

import { Transaction } from "@/types/api";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const baseUrl = process.env.API_BASE_URL;

export async function getAllTransactions(url: string): Promise<Transaction[]> {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const response = await fetch(baseUrl + url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.id_token}`,
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
  transaction: Transaction,
): Promise<Transaction> {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const response = await fetch(baseUrl + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.id_token}`,
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
