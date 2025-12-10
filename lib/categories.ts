"use server";

import { Category } from "@/types/api";
import { fetchWithAuth } from "./api";

export async function getAllCategories(url: string): Promise<Category[]> {
  try {
    return await fetchWithAuth<Category[]>(url);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return Promise.reject("Failed to fetch categories");
  }
}
