import { renderHook } from "@testing-library/react";
import { useAnalyticsData } from "./hooks";
import { describe, it } from "vitest";

describe("useAnalyticsData", () => {
  it("should render without crashing", () => {
    renderHook(() => useAnalyticsData(null, null));
  });
});
