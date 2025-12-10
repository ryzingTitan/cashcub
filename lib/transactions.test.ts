import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "./transactions";
import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
} from "vitest";
import { auth0 } from "./auth0";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

process.env.API_BASE_URL = "http://localhost:3001/api";

const server = setupServer(
  http.get("http://localhost:3001/api/transactions", () => {
    return HttpResponse.json([{ id: 1, amount: 100 }]);
  }),
  http.post("http://localhost:3001/api/transactions", () => {
    return HttpResponse.json({ id: 2, amount: 200 });
  }),
  http.put("http://localhost:3001/api/transactions/1", () => {
    return HttpResponse.json({ id: 1, amount: 150 });
  }),
  http.delete("http://localhost:3001/api/transactions/1", () => {
    return new HttpResponse(null, { status: 204 });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock("./auth0", () => ({
  auth0: {
    getAccessToken: vi.fn(),
  },
}));

describe("Transaction API functions", () => {
  beforeEach(() => {
    vi.mocked(auth0.getAccessToken).mockResolvedValue({
      token: "test-access-token",
    });
  });

  it("getAllTransactions should fetch transactions successfully", async () => {
    const data = await getAllTransactions("/transactions");
    expect(data).toEqual([{ id: 1, amount: 100 }]);
  });

  it("createTransaction should create a transaction successfully", async () => {
    const data = await createTransaction("/transactions", { amount: 200 });
    expect(data).toEqual({ id: 2, amount: 200 });
  });

  it("updateTransaction should update a transaction successfully", async () => {
    const data = await updateTransaction("/transactions", "1", { amount: 150 });
    expect(data).toEqual({ id: 1, amount: 150 });
  });

  it("deleteTransaction should delete a transaction successfully", async () => {
    await expect(
      deleteTransaction("/transactions", "1"),
    ).resolves.toBeUndefined();
  });

  it("getAllTransactions should reject with an error if the fetch fails", async () => {
    server.use(
      http.get("http://localhost:3001/api/transactions", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    await expect(getAllTransactions("/transactions")).rejects.toEqual(
      "Failed to fetch transactions",
    );
  });

  it("createTransaction should reject with an error if the fetch fails", async () => {
    server.use(
      http.post("http://localhost:3001/api/transactions", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    await expect(
      createTransaction("/transactions", { amount: 200 }),
    ).rejects.toEqual("Failed to create transaction");
  });

  it("updateTransaction should reject with an error if the fetch fails", async () => {
    server.use(
      http.put("http://localhost:3001/api/transactions/1", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    await expect(
      updateTransaction("/transactions", "1", { amount: 150 }),
    ).rejects.toEqual("Failed to update transaction");
  });

  it("deleteTransaction should reject with an error if the fetch fails", async () => {
    server.use(
      http.delete("http://localhost:3001/api/transactions/1", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    await expect(deleteTransaction("/transactions", "1")).rejects.toEqual(
      "Failed to delete transaction",
    );
  });
});
