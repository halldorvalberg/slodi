import { buildApiUrl } from "@/lib/api-utils";
import { fetchWithAuth } from "@/lib/api";
import {
  buildContentPayload,
  type ContentCreateInput,
  type ContentItem,
} from "@/services/content.service";

/**
 * Creating an Event — something that happens at a time.
 *
 * The one field no other type has: `start_dt`. `events.start_dt` is NOT NULL in
 * the database, so an Event without a start is not representable — the form
 * collects it rather than letting the backend fall back to a default the leader
 * never chose.
 */
export type EventCreateInput = ContentCreateInput & {
  /** Local datetime from the form, e.g. "2026-09-16T19:30". */
  start_dt: string;
  end_dt?: string;
};

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
      body: JSON.stringify({
        ...buildContentPayload(input),
        content_type: "event" as const,
        start_dt: input.start_dt,
        end_dt: input.end_dt || null,
      }),
    },
    getToken
  );
  return Array.isArray(data) ? data[0] : data;
}
