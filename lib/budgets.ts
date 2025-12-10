"use server";

import { Budget, BudgetItem, BudgetSummary } from "@/types/api";
import { fetchWithAuth } from "./api";

const handleBudgetError = (error: unknown, message: string) => {
  console.error(`${message}:`, error);
  return Promise.reject(message);
};

export async function getAllBudgets(url: string): Promise<Budget[]> {
  try {
    return await fetchWithAuth<Budget[]>(url);
  } catch (error) {
    return handleBudgetError(error, "Failed to fetch budgets");
  }
}

export async function createBudget(
  url: string,
  budget: Partial<Budget>,
): Promise<Budget> {
  try {
    return await fetchWithAuth<Budget>(url, {
      method: "POST",
      body: budget,
    });
  } catch (error) {
    return handleBudgetError(error, "Failed to create budget");
  }
}

export async function cloneBudget(
  url: string,
  budget: Partial<Budget>,
): Promise<Budget> {
  try {
    return await fetchWithAuth<Budget>(url, {
      method: "POST",
      body: budget,
    });
  } catch (error) {
    return handleBudgetError(error, "Failed to clone budget");
  }
}

export async function createBudgetItem(
  url: string,
  budgetItem: Partial<BudgetItem>,
): Promise<BudgetItem> {
  try {
    return await fetchWithAuth<BudgetItem>(url, {
      method: "POST",
      body: budgetItem,
    });
  } catch (error) {
    return handleBudgetError(error, "Failed to create budget item");
  }
}

export async function deleteBudgetItem(url: string): Promise<void> {
  try {
    await fetchWithAuth<void>(url, { method: "DELETE" });
  } catch (error) {
    return handleBudgetError(error, "Failed to delete budget item");
  }
}

export async function updateBudgetItem(
  url: string,
  budgetItem: Partial<BudgetItem>,
): Promise<BudgetItem> {
  try {
    return await fetchWithAuth<BudgetItem>(url, {
      method: "PUT",
      body: budgetItem,
    });
  } catch (error) {
    return handleBudgetError(error, "Failed to update budget item");
  }
}

export async function getBudgetSummary(url: string): Promise<BudgetSummary> {
  try {
    return await fetchWithAuth<BudgetSummary>(url);
  } catch (error) {
    return handleBudgetError(error, "Failed to fetch budget summary");
  }
}
