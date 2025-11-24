import { render, screen } from "@testing-library/react";
import AddTransactionModal from "./AddTransactionModal";
import { describe, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useParams: () => ({ slug: "123" }),
}));

describe("AddTransactionModal", () => {
  it("should render without crashing", () => {
    render(<AddTransactionModal />);
  });
});
