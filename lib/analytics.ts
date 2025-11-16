"use server";

import { BudgetSummary } from "@/types/api";
import { auth0, loginUrl } from "@/lib/auth0";
import { redirect } from "next/navigation";

const baseUrl = process.env.API_BASE_URL;

export async function getAnalyticsData(
  swrKey: string[],
): Promise<BudgetSummary[]> {
  const session = await auth0.getSession();

  if (!session) {
    redirect(loginUrl);
  }

  const fullUrl = new URL(baseUrl + swrKey[0]);
  const params = { startDate: swrKey[1], endDate: swrKey[2] };
  fullUrl.search = new URLSearchParams(params).toString();

  const response = await fetch(fullUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.tokenSet.idToken}`,
    },
  });

  if (!response.ok) {
    console.error(
      `Failed to fetch analytics data with status: ${response.status}`,
    );
    return Promise.reject("Failed to fetch analytics data");
  }
  return response.json();
}
