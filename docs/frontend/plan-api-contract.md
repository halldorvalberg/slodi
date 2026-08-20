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

## Not in this contract yet

The grid matrix endpoint (A2), `Event.type`/`scope`, and the `Task` planning dimensions are separate tickets. A1 is only the container and the shell.
