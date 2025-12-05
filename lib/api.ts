"use server";

import { auth0 } from "@/lib/auth0";
import { ApiError } from "./apiError";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  params?: Record<string, string>;
};

export async function fetchWithAuth<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const session = await auth0.getSession();

  // Session validation is now handled by callers before try-catch blocks
  if (!session?.tokenSet?.idToken) {
    throw new Error("No valid session");
  }

  const baseUrl = process.env.API_BASE_URL;
  const fullUrl = new URL(baseUrl + url);

  if (options.params) {
    fullUrl.search = new URLSearchParams(options.params).toString();
  }

  const response = await fetch(fullUrl, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.tokenSet.idToken}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(
      `Request failed with status ${response.status}: ${errorText}`,
      response.status,
      response.statusText,
    );
  }

  if (response.status === 204) {
    return Promise.resolve(undefined as T);
  }

  return response.json();
}
