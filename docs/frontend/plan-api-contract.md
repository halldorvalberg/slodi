# Plan API contract — A1 (sc-34)

The frontend half of A1 is built and merged ahead of the backend half. This is the contract it calls, so the two halves meet without a second negotiation.

Source of truth for the shapes: `docs/tharfagreining2/terms-and-datamodel.md` §11 (container model) and ADR-002. The frontend types live in `frontend/services/plan.service.ts` — if these disagree, that file is what ships.

## The one new entity

§11 settles that only **one** entity is needed above what the backend already has:

```
Workspace (= heildardagskrá)          ✅ exists
  └─ Season { starfsár | scratchpad } ← new
       └─ Program { dagskrárhringur | útilega | mót }  ✅ exists
            └─ Event ✅ → Task ✅
```

A `Season` is an **optional grouping** of Programs. A Program keeps its mandatory `workspace_id`, so nothing about today's bank changes. The Workspace *is* the heildardagskrá — it is not a new table.

## Endpoints the frontend calls

### `GET /workspaces/{workspace_id}/seasons` → `Season[]`

Every season in the workspace, dated and undated alike. The frontend sorts; the backend need not.

### `POST /workspaces/{workspace_id}/seasons` → `Season`

Body is `SeasonCreate` below.

## Shapes

```ts
type SeasonKind = "starfsar" | "scratchpad";

type Season = {
  id: string;
  workspace_id: string;
  name: string;            // "Starfsárið 2026–27", or a scratchpad's given name
  kind: SeasonKind;
  starts_on: string | null; // ISO date. null on a scratchpad
  ends_on: string | null;   // ISO date. null on a scratchpad
  created_at: string;       // ISO datetime
};

type SeasonCreate = {
  workspace_id: string;
  name: string;
  kind: SeasonKind;
  starts_on?: string | null;
  ends_on?: string | null;
};
```

## Two things worth knowing

**The scratchpad is not a separate feature.** It is a `Season` with null dates. That is deliberate: A3's "play with putting a dagskrá together" and A8's draft state both fall out of the same model instead of needing their own. A backend that makes the scratchpad its own table or a boolean flag on something else would break that, and A8 would need reworking.

**A 404 is treated as "not built yet", not as an error.** Until these endpoints exist the plan route shows a "backend is on its way" notice rather than an error state, and starts showing real data the moment they land — no frontend change required. Anything other than 404 surfaces as a genuine failure, so please don't return 404 for "this workspace has no seasons"; return `[]`.

## The grid matrix — A2 (sc-37)

### `GET /seasons/{season_id}/grid` → `PlanGrid`

```ts
type EventType = "skipulags" | "sveitar" | "flokks" | "uppskeru" | "utilega" | "dagsferd" | "mot";
type PlanStatus = "unknown" | "tentative" | "draft" | "confirmed";

type Patrol = { id: string; name: string };            // a flokkur — one column
type PlanWeek = { index: number; starts_on: string | null; label: string };  // one row

type PlanCell = {          // a per-flokkur event: one cell
  event_id: string;
  week_index: number;
  patrol_id: string;
  title: string;
  status: PlanStatus;
  type: EventType;
  span_weeks: number;      // 1 unless it runs over several weeks
};

type PlanBand = Omit<PlanCell, "patrol_id">;  // a troop-wide event: the whole row

type PlanGrid = {
  season_id: string;
  patrols: Patrol[];
  weeks: PlanWeek[];
  bands: PlanBand[];
  cells: PlanCell[];
};
```

**Bands and cells are split by `Event.scope`**, not by type. `troop-wide` becomes a band spanning every patrol column; `per-flokkur` becomes a cell in one column. That split is what lets parallel flokksfundir coexist in a period while a útilega takes the whole week.

**`status: "unknown"` is the "?" marker** of ADR-002 §3, not a missing value. A leader setting the skeleton early needs to say "something goes here, undecided" and have it render as a deliberate mark rather than an empty cell. Please don't collapse it to null.

**`span_weeks` counts the first week.** `1` means a single week; `2` means this week and the next. The frontend skips the positions a span covers, so an off-by-one here shears the grid sideways.

`patrols` and `weeks` are the axes — send them even when there are no events, so the grid can render an empty term rather than nothing.

## Not in this contract yet

Writing to the grid — creating, moving and renaming events in a cell — is A3 (sc-38), which is where inline edit and autosave live. The `Task` planning dimensions below the event (venue, timing, endurmat) come with their own tickets. What is here covers reading a season and reading its grid, which is what A1 and A2 need.
