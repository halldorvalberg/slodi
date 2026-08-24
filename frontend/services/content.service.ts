import { buildApiUrl } from "@/lib/api-utils";
import { fetchWithAuth } from "@/lib/api";
import type { Program } from "@/services/programs.service";

/**
 * The bank, as every content type rather than only Programs.
 *
 * ## Why this exists next to programs.service.ts
 *
 * Everything in the bank used to be stored as a `Program`, which was a
 * mis-classification: per the confirmed data model a single bank item — a
 * leikur, a setning, one activity — is a **`Task`** (dagskrárliður, the
 * smallest unit). A `Program` is a *collection* of Events and Tasks: a
 * dagskrárhringur, a útilega, a mót.
 *
 * So the list endpoint had to stop being `/workspaces/{id}/programs` and become
 * `/workspaces/{id}/content`, which selects `Content` polymorphically and
 * returns all three types with a `content_type` discriminator.
 *
 * `programs.service.ts` keeps its create/update/delete calls — those endpoints
 * are per-type and still correct. Only *reading the bank* moved here.
 */

export type ContentType = "program" | "event" | "task";

/**
 * A bank item of any type.
 *
 * The shared fields are `ContentListOut` on the backend, which every subtype
 * inherits, so this is `Program` with the discriminator widened plus the few
 * fields only an Event carries. Reusing the existing type rather than
 * redeclaring forty fields keeps the two from drifting apart.
 */
export type ContentItem = Omit<Program, "content_type"> & {
  content_type: ContentType;
  /** Events only. `events.start_dt` is NOT NULL, so an Event always has one. */
  start_dt?: string | null;
  end_dt?: string | null;
};

/** Icelandic labels for the three types, for filters and badges. */
export const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  task: "Verkefni",
  event: "Viðburður",
  program: "Dagskrá",
};

/** The order they are offered in — smallest unit first, as the model reads. */
export const CONTENT_TYPES: ContentType[] = ["task", "event", "program"];

type ContentResponse = ContentItem[] | { content: ContentItem[] };

/**
 * Every content item in a workspace.
 *
 * The limit mirrors `fetchPrograms`: the bank is small enough to hold in memory
 * and every filter is applied client-side, so paging it would only add a
 * round-trip per keystroke.
 */
export async function fetchContent(
  workspaceId: string,
  getToken: () => Promise<string | null>
): Promise<ContentItem[]> {
  const url = buildApiUrl(`/workspaces/${workspaceId}/content?limit=200`);
  const data = await fetchWithAuth<ContentResponse>(url, { method: "GET" }, getToken);
  return Array.isArray(data) ? data : data.content || [];
}

/** One content item, whatever its type. */
export async function fetchContentById(
  id: string,
  getToken: () => Promise<string | null>
): Promise<ContentItem> {
  const url = buildApiUrl(`/content/${id}`);
  return fetchWithAuth<ContentItem>(url, { method: "GET" }, getToken);
}

/** The fields every content type shares, as the create endpoints take them. */
export type ContentCreateInput = {
  name: string;
  description?: string;
  image?: string;
  instructions?: string;
  equipment?: string[];
  duration_min?: number;
  duration_max?: number;
  prep_time_min?: number;
  prep_time_max?: number;
  age?: string[];
  location?: string;
  count_min?: number;
  count_max?: number;
  price?: number;
  tagNames?: string[];
  workspaceId: string;
};

/**
 * The shared half of a create payload.
 *
 * All three create endpoints take the same `ContentBase` fields — only the
 * discriminator and a couple of Event-specific dates differ. Building it once
 * means a field added to the model does not have to be remembered in three
 * places.
 *
 * Empty strings and empty arrays become `null` rather than being omitted: the
 * backend treats absent and null identically on create, and being explicit
 * makes the request readable in the network tab.
 */
export function buildContentPayload(input: ContentCreateInput): Record<string, unknown> {
  return {
    name: input.name.trim(),
    description: input.description?.trim() || null,
    image: input.image?.trim() || null,
    instructions: input.instructions?.trim() || null,
    equipment: input.equipment?.length ? input.equipment : null,
    duration_min: input.duration_min ?? null,
    duration_max: input.duration_max ?? null,
    prep_time_min: input.prep_time_min ?? null,
    prep_time_max: input.prep_time_max ?? null,
    age: input.age?.length ? input.age : null,
    location: input.location?.trim() || null,
    count_min: input.count_min ?? null,
    count_max: input.count_max ?? null,
    price: input.price ?? null,
    tag_names: input.tagNames?.length ? input.tagNames : null,
  };
}
