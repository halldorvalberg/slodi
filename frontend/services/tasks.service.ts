import { buildApiUrl } from "@/lib/api-utils";
import { fetchWithAuth } from "@/lib/api";
import {
  buildContentPayload,
  type ContentCreateInput,
  type ContentItem,
} from "@/services/content.service";

/**
 * Creating a Task — a dagskrárliður, the smallest unit in the bank.
 *
 * A leikur, a setning, one activity. This is what most bank items actually are,
 * and what they all become once the reclassify migration runs.
 *
 * Only create lives here. Reading goes through `content.service.ts`, which is
 * polymorphic; updating and deleting are Content-level and already handled.
 */
export async function createTask(
  input: ContentCreateInput,
  getToken: () => Promise<string | null>
): Promise<ContentItem> {
  const url = buildApiUrl(`/workspaces/${input.workspaceId}/tasks`);
  const data = await fetchWithAuth<ContentItem | ContentItem[]>(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...buildContentPayload(input), content_type: "task" as const }),
    },
    getToken
  );
  return Array.isArray(data) ? data[0] : data;
}
