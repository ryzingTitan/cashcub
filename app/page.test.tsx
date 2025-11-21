import { render } from "@testing-library/react";
import Home from "./page";
import { auth0, loginUrl } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { vi, describe, it, expect, Mock } from "vitest";

vi.mock("@/lib/auth0", () => ({
  auth0: {
    getSession: vi.fn(),
  },
  loginUrl: "/api/auth/login",
}));
vi.mock("next/navigation");

describe("Home page", () => {
  it("should redirect to the login URL if there is no session", async () => {
    (auth0.getSession as Mock).mockResolvedValue(null);
    render(await Home());
    expect(redirect).toHaveBeenCalledWith("/api/auth/login");
  });

  it("should redirect to the budgets page if there is a session", async () => {
    (auth0.getSession as Mock).mockResolvedValue({ user: {} });
    render(await Home());
    expect(redirect).toHaveBeenCalledWith("/budgets");
  });
});
