"use server";

import { Category } from "@/types/api";
import { redirect } from "next/navigation";
import { auth0, loginUrl } from "@/lib/auth0";

const baseUrl = process.env.API_BASE_URL;

export async function getAllCategories(url: string): Promise<Category[]> {
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
    console.error(`Failed to fetch categories with status: ${response.status}`);
    return Promise.reject("Failed to fetch categories");
  }
  return response.json();
}
