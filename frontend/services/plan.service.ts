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

// ── The grid (A2, sc-37) ─────────────────────────────────────────────────────

/**
 * ADR-002 §1. Drives default slot sets and behaviour; on the grid it drives
 * how a cell reads at a glance.
 */
export type EventType =
  | "skipulags"
  | "sveitar"
  | "flokks"
  | "uppskeru"
  | "utilega"
  | "dagsferd"
  | "mot";

/**
 * ADR-002 §1. This is what lets parallel flokksfundir coexist in one period:
 * troop-wide events span every column, per-flokkur events occupy one.
 */
export type EventScope = "troop-wide" | "per-flokkur";

/**
 * ADR-002 §3. `unknown` is the first-class "?" marker — a leader setting the
 * skeleton early needs to say "something goes here, not decided yet" without
 * the plan looking broken (A8).
 */
export type PlanStatus = "unknown" | "tentative" | "draft" | "confirmed";

/** A flokkur — one column of the grid. `Patrol` per terms-and-datamodel §3. */
export type Patrol = {
  id: string;
  name: string;
};

/** One row of the grid. Undated on a scratchpad, which is why `starts_on` is nullable. */
export type PlanWeek = {
  index: number;
  starts_on: string | null;
  label: string;
};

type PlanEntryBase = {
  event_id: string;
  week_index: number;
  title: string;
  status: PlanStatus;
  type: EventType;
  /** ADR-002 §3 — an element may run over several weeks (badge part 1/2). */
  span_weeks: number;
};

/** A per-flokkur event: one cell, in one patrol's column. */
export type PlanCell = PlanEntryBase & {
  patrol_id: string;
};

/** A troop-wide event: a band across every patrol column. */
export type PlanBand = PlanEntryBase;

export type PlanGrid = {
  season_id: string;
  patrols: Patrol[];
  weeks: PlanWeek[];
  bands: PlanBand[];
  cells: PlanCell[];
};

/** The week×flokkur matrix for one season. */
export async function getSeasonGrid(seasonId: string, getToken: GetToken): Promise<PlanGrid> {
  try {
    return await fetchWithAuth<PlanGrid>(buildApiUrl(`/seasons/${seasonId}/grid`), {}, getToken);
  } catch (error) {
    if (isMissingEndpoint(error)) throw new SeasonsUnavailable();
    throw error;
  }
}

/**
 * Index the cells by week and patrol so the renderer is a lookup rather than a
 * scan per cell. A term across six patrols is ~200 cells; scanning the flat
 * list for each would be quadratic for no reason.
 */
export function indexCells(cells: PlanCell[]): Map<string, PlanCell> {
  const byPosition = new Map<string, PlanCell>();
  for (const cell of cells) byPosition.set(cellKey(cell.week_index, cell.patrol_id), cell);
  return byPosition;
}

export function cellKey(weekIndex: number, patrolId: string): string {
  return `${weekIndex}:${patrolId}`;
}

/**
 * Weeks a multi-week entry covers *after* its first, which the renderer must
 * skip so a rowSpan does not collide with a cell drawn underneath it.
 */
export function coveredWeeks(entry: PlanEntryBase): number[] {
  const covered: number[] = [];
  for (let offset = 1; offset < Math.max(1, entry.span_weeks); offset++) {
    covered.push(entry.week_index + offset);
  }
  return covered;
}
