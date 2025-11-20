import {
    getAllBudgets,
    createBudget,
    cloneBudget,
    createBudgetItem,
    deleteBudgetItem,
    updateBudgetItem,
    getBudgetSummary,
  } from "./budgets";
  import { describe, it, expect, vi, beforeAll, afterAll, afterEach, beforeEach } from "vitest";
  import { auth0 } from "./auth0";
  import { http, HttpResponse } from "msw";
  import { setupServer } from "msw/node";

  process.env.API_BASE_URL = "http://localhost:3001/api";

  const server = setupServer(
    http.get("http://localhost:3001/api/budgets", () => {
      return HttpResponse.json([{ id: 1, name: "Test Budget" }]);
    }),
    http.post("http://localhost:3001/api/budgets", () => {
      return HttpResponse.json({ id: 2, name: "New Budget" });
    }),
    http.post("http://localhost:3001/api/budgets/1/clone", () => {
        return HttpResponse.json({ id: 3, name: "Cloned Budget" });
    }),
    http.post("http://localhost:3001/api/budget-items", () => {
        return HttpResponse.json({ id: 1, name: "New Item" });
    }),
    http.delete("http://localhost:3001/api/budget-items/1", () => {
        return new HttpResponse(null, { status: 204 });
    }),
    http.put("http://localhost:3001/api/budget-items/1", () => {
        return HttpResponse.json({ id: 1, name: "Updated Item" });
    }),
    http.get("http://localhost:3001/api/budgets/summary/1", () => {
        return HttpResponse.json({ totalBudget: 1000, totalSpending: 500 });
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  vi.mock("./auth0", () => ({
    auth0: {
      getSession: vi.fn(),
    },
    ensureValidSession: vi.fn(),
  }));

  describe("Budget API functions", () => {
    beforeEach(() => {
        vi.mocked(auth0.getSession).mockResolvedValue({
            user: {},
            tokenSet: { idToken: "test" },
        });
    });

    it("getAllBudgets should fetch budgets successfully", async () => {
      const data = await getAllBudgets("/budgets");
      expect(data).toEqual([{ id: 1, name: "Test Budget" }]);
    });

    it("createBudget should create a budget successfully", async () => {
      const data = await createBudget("/budgets", { name: "New Budget" });
      expect(data).toEqual({ id: 2, name: "New Budget" });
    });

    it("cloneBudget should clone a budget successfully", async () => {
        const data = await cloneBudget("/budgets/1/clone", {});
        expect(data).toEqual({ id: 3, name: "Cloned Budget" });
    });

    it("createBudgetItem should create a budget item successfully", async () => {
        const data = await createBudgetItem("/budget-items", { name: "New Item" });
        expect(data).toEqual({ id: 1, name: "New Item" });
    });

    it("deleteBudgetItem should delete a budget item successfully", async () => {
        await expect(deleteBudgetItem("/budget-items/1")).resolves.toBeUndefined();
    });

    it("updateBudgetItem should update a budget item successfully", async () => {
        const data = await updateBudgetItem("/budget-items/1", { name: "Updated Item" });
        expect(data).toEqual({ id: 1, name: "Updated Item" });
    });

    it("getBudgetSummary should fetch budget summary successfully", async () => {
        const data = await getBudgetSummary("/budgets/summary/1");
        expect(data).toEqual({ totalBudget: 1000, totalSpending: 500 });
    });

    it("getAllBudgets should reject with an error if the fetch fails", async () => {
        server.use(
            http.get("http://localhost:3001/api/budgets", () => {
                return new HttpResponse(null, { status: 500 });
            })
        );
        await expect(getAllBudgets("/budgets")).rejects.toEqual("Failed to fetch budgets");
    });

    it("createBudget should reject with an error if the fetch fails", async () => {
        server.use(
            http.post("http://localhost:3001/api/budgets", () => {
                return new HttpResponse(null, { status: 500 });
            })
        );
        await expect(createBudget("/budgets", { name: "New Budget" })).rejects.toEqual("Failed to create budget");
    });

    it("cloneBudget should reject with an error if the fetch fails", async () => {
        server.use(
            http.post("http://localhost:3001/api/budgets/1/clone", () => {
                return new HttpResponse(null, { status: 500 });
            })
        );
        await expect(cloneBudget("/budgets/1/clone", {})).rejects.toEqual("Failed to clone budget");
    });

    it("createBudgetItem should reject with an error if the fetch fails", async () => {
        server.use(
            http.post("http://localhost:3001/api/budget-items", () => {
                return new HttpResponse(null, { status: 500 });
            })
        );
        await expect(createBudgetItem("/budget-items", { name: "New Item" })).rejects.toEqual("Failed to create budget item");
    });

    it("deleteBudgetItem should reject with an error if the fetch fails", async () => {
        server.use(
            http.delete("http://localhost:3001/api/budget-items/1", () => {
                return new HttpResponse(null, { status: 500 });
            })
        );
        await expect(deleteBudgetItem("/budget-items/1")).rejects.toEqual("Failed to delete budget item");
    });

    it("updateBudgetItem should reject with an error if the fetch fails", async () => {
        server.use(
            http.put("http://localhost:3001/api/budget-items/1", () => {
                return new HttpResponse(null, { status: 500 });
            })
        );
        await expect(updateBudgetItem("/budget-items/1", { name: "Updated Item" })).rejects.toEqual("Failed to update budget item");
    });

    it("getBudgetSummary should reject with an error if the fetch fails", async () => {
        server.use(
            http.get("http://localhost:3001/api/budgets/summary/1", () => {
                return new HttpResponse(null, { status: 500 });
            })
        );
        await expect(getBudgetSummary("/budgets/summary/1")).rejects.toEqual("Failed to fetch budget summary");
    });
  });
