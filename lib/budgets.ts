"use server";

import { Budget, BudgetItem, BudgetSummary } from "@/types/api";
import { redirect } from "next/navigation";
import { auth0, loginUrl } from "@/lib/auth0";

const baseUrl = process.env.API_BASE_URL;

export async function getAllBudgets(url: string): Promise<Budget[]> {
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
    console.error(`Failed to fetch budgets with status: ${response.status}`);
    return Promise.reject("Failed to fetch budgets");
  }
  return response.json();
}

export async function createBudget(
  url: string,
  budget: Partial<Budget>,
): Promise<Budget> {
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
    body: JSON.stringify(budget),
  });

  if (!response.ok) {
    console.error(`Failed to create budget with status: ${response.status}`);
    return Promise.reject("Failed to create budget");
  }
  return response.json();
}

export async function cloneBudget(
  url: string,
  budget: Partial<Budget>,
): Promise<Budget> {
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
    body: JSON.stringify(budget),
  });

  if (!response.ok) {
    console.error(`Failed to clone budget with status: ${response.status}`);
    return Promise.reject("Failed to clone budget");
  }
  return response.json();
}

export async function createBudgetItem(
  url: string,
  budgetItem: Partial<BudgetItem>,
): Promise<BudgetItem> {
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
    body: JSON.stringify(budgetItem),
  });

  if (!response.ok) {
    console.error(
      `Failed to create budget item with status: ${response.status}`,
    );
    return Promise.reject("Failed to create budget item");
  }
  return response.json();
}

export async function deleteBudgetItem(url: string): Promise<void> {
  const session = await auth0.getSession();

  if (!session) {
    redirect(loginUrl);
  }

  const response = await fetch(baseUrl + url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokenSet.idToken}`,
    },
  });

  if (!response.ok) {
    console.error(
      `Failed to delete budget item with status: ${response.status}`,
    );
    return Promise.reject("Failed to delete budget item");
  }
}

export async function updateBudgetItem(
  url: string,
  budgetItem: Partial<BudgetItem>,
): Promise<BudgetItem> {
  const session = await auth0.getSession();

  if (!session) {
    redirect(loginUrl);
  }

  const response = await fetch(baseUrl + url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokenSet.idToken}`,
    },
    body: JSON.stringify(budgetItem),
  });

  if (!response.ok) {
    console.error(
      `Failed to update budget item with status: ${response.status}`,
    );
    return Promise.reject("Failed to update budget item");
  }
  return response.json();
}

export async function getBudgetSummary(url: string): Promise<BudgetSummary> {
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
      `Failed to fetch budget summary with status: ${response.status}`,
    );
    return Promise.reject("Failed to fetch budget summary");
  }
  return response.json();
}
