import { buildApiUrl } from "@/lib/api-utils";
import { fetchWithAuth } from "@/lib/api";

/**
 * The plan API — seasons and the scratchpad (A1, sc-34).
 *
 * ## Where these shapes come from
 *
 * `docs/tharfagreining2/terms-and-datamodel.md` §11 settles the container model,
 * and only **one** new entity is needed above what the backend already has:
 *
 *   Workspace (= heildardagskrá, exists)
 *     └─ Season { starfsár | scratchpad }   ← new
 *          └─ Program { dagskrárhringur | útilega | mót }  (exists)
 *               └─ Event (exists) └─ Task (exists)
 *
 * A `Season` is an *optional grouping* of Programs. A Program still belongs to
 * a Workspace directly, so nothing here changes how the bank works today.
 *
 * ## Status: contract-first
 *
 * The backend half of A1 is a separate track. These types are the contract that
 * half implements, so they are written against the confirmed data model rather
 * than against whatever ships first. Until the endpoints exist, `getSeasons`
 * returns an empty list on 404 (see `SeasonsUnavailable`) so the shell renders
 * its empty state instead of erroring — the plan route is reachable and
 * reviewable now, and starts showing real data the moment the API lands.
 */

/**
 * A season is either the dated work-year or the undated scratchpad.
 *
 * The scratchpad is not a separate feature: it is a Season with no dates, which
 * is what makes "play with putting a dagskrá together" (A3) and the draft state
 * (A8, §11) fall out of the same model rather than needing their own.
 */
export type SeasonKind = "starfsar" | "scratchpad";

export type Season = {
  id: string;
  workspace_id: string;
  /** "Starfsárið 2026–27", or a name the leader gave their scratchpad. */
  name: string;
  kind: SeasonKind;
  /** ISO dates. Null on a scratchpad — that is what "undated" means here. */
  starts_on: string | null;
  ends_on: string | null;
  created_at: string;
};

export type SeasonCreate = {
  workspace_id: string;
  name: string;
  kind: SeasonKind;
  starts_on?: string | null;
  ends_on?: string | null;
};

/**
 * Thrown when the plan endpoints are not deployed yet.
 *
 * Distinct from a real failure on purpose: the shell shows "not available yet"
 * rather than "something went wrong", which are different things to tell a
 * leader, and only one of them is worth reporting as a bug.
 */
export class SeasonsUnavailable extends Error {
  constructor() {
    super("The plan API is not available yet");
    this.name = "SeasonsUnavailable";
  }
}

type GetToken = () => Promise<string | null>;

function isMissingEndpoint(error: unknown): boolean {
  return error instanceof Error && /\b404\b|not found/i.test(error.message);
}

/** Every season in a workspace, dated and undated alike. */
export async function getSeasons(workspaceId: string, getToken: GetToken): Promise<Season[]> {
  try {
    return await fetchWithAuth<Season[]>(
      buildApiUrl(`/workspaces/${workspaceId}/seasons`),
      {},
      getToken
    );
  } catch (error) {
    if (isMissingEndpoint(error)) throw new SeasonsUnavailable();
    throw error;
  }
}

export async function createSeason(payload: SeasonCreate, getToken: GetToken): Promise<Season> {
  return fetchWithAuth<Season>(
    buildApiUrl(`/workspaces/${payload.workspace_id}/seasons`),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    getToken
  );
}

/** Sort order for the season switcher: scratchpads last, newest first. */
export function compareSeasons(a: Season, b: Season): number {
  if (a.kind !== b.kind) return a.kind === "starfsar" ? -1 : 1;
  const aKey = a.starts_on ?? a.created_at;
  const bKey = b.starts_on ?? b.created_at;
  return bKey.localeCompare(aKey);
}
