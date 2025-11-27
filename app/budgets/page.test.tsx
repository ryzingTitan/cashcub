import { render } from "@testing-library/react";
import Budgets from "./page";
import { describe, it, expect } from "vitest";

describe("Budgets page", () => {
  it("should render an empty fragment", () => {
    const { container } = render(<Budgets />);
    expect(container.firstChild).toBeNull();
  });
});
