"use server";

import { Category } from "@/types/api";
import { auth0, ensureValidSession } from "@/lib/auth0";

export async function getAllCategories(url: string): Promise<Category[]> {
  const session = await auth0.getSession();
  ensureValidSession(session);

  const baseUrl = process.env.API_BASE_URL;
  const response = await fetch(baseUrl + url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.tokenSet.idToken}`,
    },
  });

  if (!response.ok) {
    console.error(`Failed to fetch categories with status: ${response.status}`);
    return Promise.reject("Failed to fetch categories");
  }
  return response.json();
}
