"use server";

import { Category } from "@/types/api";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const baseUrl = process.env.API_BASE_URL;

export async function getAllCategories(url: string): Promise<Category[]> {
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
    console.error(`Failed to fetch categories with status: ${response.status}`);
    return Promise.reject("Failed to fetch categories");
  }
  return response.json();
}
