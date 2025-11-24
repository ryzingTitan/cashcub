import { describe, it, expect } from "vitest";
import { ApiError, isApiError } from "./api-error";

describe("ApiError", () => {
  it("should create an instance of ApiError", () => {
    const error = new ApiError("Test Error", 500, "Internal Server Error");
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Test Error");
    expect(error.status).toBe(500);
    expect(error.statusText).toBe("Internal Server Error");
    expect(error.name).toBe("ApiError");
  });
});

describe("isApiError", () => {
  it("should return true for an instance of ApiError", () => {
    const error = new ApiError("Test Error", 500, "Internal Server Error");
    expect(isApiError(error)).toBe(true);
  });

  it("should return false for a regular Error", () => {
    const error = new Error("Test Error");
    expect(isApiError(error)).toBe(false);
  });

  it("should return false for other types", () => {
    expect(isApiError("string")).toBe(false);
    expect(isApiError(123)).toBe(false);
    expect(isApiError({})).toBe(false);
    expect(isApiError(null)).toBe(false);
    expect(isApiError(undefined)).toBe(false);
  });
});
