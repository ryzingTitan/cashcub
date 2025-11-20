"use server";

import { auth0, ensureValidSession } from "@/lib/auth0";

type FetchOptions<TBody> = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: TBody;
  params?: Record<string, string>;
};

export async function fetchWithAuth<TResponse, TBody = {}>(
  url: string,
  options: FetchOptions<TBody> = {},
): Promise<TResponse> {
  const session = await auth0.getSession();
  ensureValidSession(session);

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
    console.error(`Request to ${url} failed with status: ${response.status}`);
    return Promise.reject(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return Promise.resolve(undefined as TResponse);
  }

  return response.json();
}
