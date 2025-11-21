import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BudgetsLayout from "./BudgetsLayout";

describe("BudgetsLayout", () => {
  it("renders children", () => {
    render(
      <BudgetsLayout>
        <div>Test Child</div>
      </BudgetsLayout>
    );

    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });
});
