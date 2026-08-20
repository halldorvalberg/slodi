import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { compareSeasons, getSeasons, SeasonsUnavailable, type Season } from "../plan.service";

const TOKEN = "test-token";
const getToken = async () => TOKEN;
const WORKSPACE = "ws-1";

function season(overrides: Partial<Season> = {}): Season {
  return {
    id: "s-1",
    workspace_id: WORKSPACE,
    name: "Starfsárið 2026–27",
    kind: "starfsar",
    starts_on: "2026-09-01",
    ends_on: "2027-05-31",
    created_at: "2026-06-01T00:00:00Z",
    ...overrides,
  };
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function response(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ "content-type": "application/json" }),
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  };
}

describe("getSeasons", () => {
  it("requests the workspace's seasons with the bearer token", async () => {
    fetchMock.mockResolvedValueOnce(response([season()]));

    const result = await getSeasons(WORKSPACE, getToken);

    expect(result).toHaveLength(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain(`/workspaces/${WORKSPACE}/seasons`);
    expect((init.headers as Record<string, string>).Authorization).toBe(`Bearer ${TOKEN}`);
  });

  it("reports a missing endpoint distinctly from a real failure", async () => {
    // The backend half of A1 is a separate track, so "not deployed yet" and
    // "something broke" are different things to tell a leader — only one of
    // them is worth reporting as a bug.
    fetchMock.mockResolvedValueOnce(response({ detail: "Not Found" }, 404));

    await expect(getSeasons(WORKSPACE, getToken)).rejects.toBeInstanceOf(SeasonsUnavailable);
  });

  it("lets a genuine server error through as an error", async () => {
    fetchMock.mockResolvedValueOnce(response({ detail: "boom" }, 500));

    const error = await getSeasons(WORKSPACE, getToken).catch((e) => e);
    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(SeasonsUnavailable);
  });
});

describe("compareSeasons", () => {
  it("puts dated starfsár before scratchpads", () => {
    // A scratchpad is the same entity with no dates. It belongs in the same
    // list, but not at the top — the work-year is what a leader opens for.
    const sorted = [
      season({ id: "krot", kind: "scratchpad", starts_on: null, ends_on: null }),
      season({ id: "year" }),
    ].sort(compareSeasons);

    expect(sorted.map((s) => s.id)).toEqual(["year", "krot"]);
  });

  it("orders starfsár newest first", () => {
    const sorted = [
      season({ id: "old", starts_on: "2024-09-01" }),
      season({ id: "new", starts_on: "2026-09-01" }),
    ].sort(compareSeasons);

    expect(sorted.map((s) => s.id)).toEqual(["new", "old"]);
  });

  it("falls back to creation order for undated scratchpads", () => {
    const sorted = [
      season({
        id: "first",
        kind: "scratchpad",
        starts_on: null,
        created_at: "2026-01-01T00:00:00Z",
      }),
      season({
        id: "later",
        kind: "scratchpad",
        starts_on: null,
        created_at: "2026-05-01T00:00:00Z",
      }),
    ].sort(compareSeasons);

    expect(sorted.map((s) => s.id)).toEqual(["later", "first"]);
  });
});
