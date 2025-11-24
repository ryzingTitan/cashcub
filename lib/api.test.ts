import { fetchWithAuth, fetcher } from "./api";
import {
  describe,
  it,
  expect,
  vi,
  afterEach,
  beforeEach,
} from "vitest";
import { ApiError } from "./api-error";

describe("fetcher", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return data on successful fetch", async () => {
    const mockData = { message: "success" };
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => mockData,
    };
    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    const data = await fetcher("/test");
    expect(data).toEqual(mockData);
  });

  it("should throw ApiError on failed fetch", async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: async () => "Error",
    };
    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    await expect(fetcher("/test")).rejects.toThrow(ApiError);
  });

  it("should return undefined for 204 status", async () => {
    const mockResponse = {
      ok: true,
      status: 204,
    };
    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    const data = await fetcher("/test");
    expect(data).toBeUndefined();
  });
});

describe("fetchWithAuth", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should make a GET request successfully", async () => {
    const mockData = { success: true };
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => mockData,
    };
    vi.mocked(fetch).mockResolvedValue(mockResponse as any);
    const data = await fetchWithAuth("/test");
    expect(data).toEqual({ success: true });
  });

  it("should make a POST request with a body successfully", async () => {
    const mockData = { success: true };
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => mockData,
    };
    vi.mocked(fetch).mockResolvedValue(mockResponse as any);
    const data = await fetchWithAuth("/test", {
      method: "POST",
      body: { message: "hello" },
    });
    expect(data).toEqual({ success: true });
  });

  it("should make a PUT request with a body successfully", async () => {
    const mockData = { success: true };
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => mockData,
    };
    vi.mocked(fetch).mockResolvedValue(mockResponse as any);
    const data = await fetchWithAuth("/test", {
      method: "PUT",
      body: { message: "hello" },
    });
    expect(data).toEqual({ success: true });
  });

  it("should make a DELETE request successfully", async () => {
    const mockResponse = {
      ok: true,
      status: 204,
    };
    vi.mocked(fetch).mockResolvedValue(mockResponse as any);
    const data = await fetchWithAuth("/test", { method: "DELETE" });
    expect(data).toBeUndefined();
  });

  it("should handle query parameters", async () => {
    const mockData = { success: true };
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => mockData,
    };
    vi.mocked(fetch).mockResolvedValue(mockResponse as any);
    const data = await fetchWithAuth("/test", { params: { foo: "bar" } });
    expect(fetch).toHaveBeenCalledWith("/test?foo=bar", expect.any(Object));
    expect(data).toEqual({ success: true });
  });

  it("should reject with an error if the fetch fails", async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    };
    vi.mocked(fetch).mockResolvedValue(mockResponse as any);
    await expect(fetchWithAuth("/test")).rejects.toThrow(
      "Request failed with status 500",
    );
  });
});
