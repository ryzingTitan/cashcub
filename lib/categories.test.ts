import { getAllCategories } from "./categories";
import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from "vitest";
import { auth0 } from "./auth0";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

process.env.API_BASE_URL = "http://localhost:3001/api";

const server = setupServer(
  http.get("http://localhost:3001/api/categories", () => {
    return HttpResponse.json([{ id: 1, name: "Groceries" }]);
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

describe("getAllCategories", () => {
  it("should fetch categories successfully", async () => {
    vi.mocked(auth0.getSession).mockResolvedValue({
      user: {},
      tokenSet: { idToken: "test" },
    });
    const data = await getAllCategories("/categories");
    expect(data).toEqual([{ id: 1, name: "Groceries" }]);
  });

  it("should reject with an error if the fetch fails", async () => {
    server.use(
        http.get("http://localhost:3001/api/categories", () => {
            return new HttpResponse(null, { status: 500 });
        })
    );
    vi.mocked(auth0.getSession).mockResolvedValue({
        user: {},
        tokenSet: { idToken: "test" },
    });
    await expect(getAllCategories("/categories")).rejects.toEqual("Failed to fetch categories");
    });
});
