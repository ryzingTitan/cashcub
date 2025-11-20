import { getAnalyticsData } from "./analytics";
import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterEach,
  afterAll,
} from "vitest";
import { auth0 } from "./auth0";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

process.env.API_BASE_URL = "http://localhost:3001/api";

const server = setupServer(
  http.get("http://localhost:3001/api/analytics", () => {
    return HttpResponse.json([{ budgetId: 1, totalSpending: 100 }]);
  }),
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

describe("getAnalyticsData", () => {
  it("should fetch analytics data successfully", async () => {
    vi.mocked(auth0.getSession).mockResolvedValue({
      user: {},
      tokenSet: { idToken: "test" },
    });
    const data = await getAnalyticsData([
      "/analytics",
      "2023-01-01",
      "2023-01-31",
    ]);
    expect(data).toEqual([{ budgetId: 1, totalSpending: 100 }]);
  });

  it("should reject with an error if the fetch fails", async () => {
    server.use(
      http.get("http://localhost:3001/api/analytics", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    vi.mocked(auth0.getSession).mockResolvedValue({
      user: {},
      tokenSet: { idToken: "test" },
    });
    await expect(
      getAnalyticsData(["/analytics", "2023-01-01", "2023-01-31"]),
    ).rejects.toEqual("Failed to fetch analytics data");
  });
});
