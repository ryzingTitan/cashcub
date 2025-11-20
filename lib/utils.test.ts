import { formatToCurrency } from "./utils";
import { describe, it, expect } from "vitest";

describe("formatToCurrency", () => {
  it("should format a valid number to USD currency", () => {
    expect(formatToCurrency(1234.56)).toBe("$1,234.56");
  });

  it("should format a valid number to EUR currency", () => {
    expect(formatToCurrency(1234.56, "EUR", "de-DE")).toBe("1.234,56 €");
  });

  it("should return $0.00 for undefined amount", () => {
    expect(formatToCurrency(undefined)).toBe("$0.00");
  });

  it("should return $0.00 for null amount", () => {
    expect(formatToCurrency(null)).toBe("$0.00");
  });

  it("should handle zero amount", () => {
    expect(formatToCurrency(0)).toBe("$0.00");
  });

  it("should handle negative amount", () => {
    expect(formatToCurrency(-1234.56)).toBe("-$1,234.56");
  });
});
