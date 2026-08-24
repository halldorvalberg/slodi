import { buildApiUrl } from "@/lib/api-utils";
import { fetchWithAuth } from "@/lib/api";
import {
  buildContentPayload,
  type ContentCreateInput,
  type ContentItem,
} from "@/services/content.service";

/**
 * Creating an Event — something the sveit does as an occasion rather than as a
 * single liður: a útilega, a mót, a dagsferð.
 *
 * ## No dates here
 *
 * A bank entry is a *template*, not an occurrence. A útilega in the bank has a
 * length — "a whole weekend" — not a date; the date only exists once a leader
 * places it in a plan, and belongs to that placement. So this sends the same
 * `duration_min`/`duration_max` span every content type carries, and no
 * `start_dt`.
 *
 * ⚠️ `events.start_dt` is NOT NULL, so the backend fills in a default the
 * leader never chose. That is a modelling gap rather than a frontend one: a
 * bank event has no date to give. Either the column should be nullable, or the
 * date should live on the planned instance. Flagged on sc-129.
 */
export type EventCreateInput = ContentCreateInput;

export async function createEvent(
  input: EventCreateInput,
  getToken: () => Promise<string | null>
): Promise<ContentItem> {
  const url = buildApiUrl(`/workspaces/${input.workspaceId}/events`);
  const data = await fetchWithAuth<ContentItem | ContentItem[]>(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...buildContentPayload(input), content_type: "event" as const }),
    },
    getToken
  );
  return Array.isArray(data) ? data[0] : data;
}
