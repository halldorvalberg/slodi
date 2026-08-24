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
