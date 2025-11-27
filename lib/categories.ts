"use server";

import { Category } from "@/types/api";
import { fetchWithAuth } from "./api";
import { auth0, ensureValidSession } from "./auth0";

export async function getAllCategories(url: string): Promise<Category[]> {
  const session = await auth0.getSession();
  ensureValidSession(session); // Redirect happens here if session invalid

  try {
    return await fetchWithAuth<Category[]>(url);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return Promise.reject("Failed to fetch categories");
  }
}
