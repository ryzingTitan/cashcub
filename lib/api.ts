import { ApiError } from "./api-error";

export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("API Error:", errorBody);
    throw new ApiError(
      `Request failed with status ${res.status}`,
      res.status,
      res.statusText,
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
};

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  params?: Record<string, string>;
};

export async function fetchWithAuth<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const fullUrl = new URL(url, window.location.origin);

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      fullUrl.searchParams.set(key, value);
    }
  }

  const response = await fetch(fullUrl.pathname + fullUrl.search, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status,
      response.statusText,
    );
  }

  if (response.status === 204) {
    return Promise.resolve(undefined as T);
  }

  return response.json();
}
