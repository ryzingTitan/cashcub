"use server";

import { BudgetSummary } from "@/types/api";
import { fetchWithAuth } from "./api";
import { auth0, ensureValidSession } from "./auth0";

export async function getAnalyticsData(
  swrKey: string[],
): Promise<BudgetSummary[]> {
  const session = await auth0.getSession();
  ensureValidSession(session); // Redirect happens here if session invalid

  try {
    return await fetchWithAuth<BudgetSummary[]>(swrKey[0], {
      params: { startDate: swrKey[1], endDate: swrKey[2] },
    });
  } catch (error) {
    console.error("Failed to fetch analytics data:", error);
    return Promise.reject("Failed to fetch analytics data");
  }
}
