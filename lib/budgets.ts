"use server";

import Budget from "@/types/api";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const baseUrl = process.env.API_BASE_URL;

export async function getAllBudgets(url: string): Promise<Budget[]> {
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
    console.error(`Failed to fetch budgets with status: ${response.status}`);
    return Promise.reject("Failed to fetch budgets");
  }
  return response.json();
}

export async function createBudget(
  url: string,
  budget: Budget,
): Promise<Budget[]> {
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
    body: JSON.stringify(budget),
  });

  if (!response.ok) {
    console.error(`Failed to create budget with status: ${response.status}`);
    return Promise.reject("Failed to create budget");
  }
  return response.json();
}
