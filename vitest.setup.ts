import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock MUI X components that import CSS files
vi.mock("@mui/x-data-grid", () => ({
  DataGrid: vi.fn(() => null),
  GridColDef: vi.fn(),
}));
