"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchContent, type ContentItem } from "@/services/content.service";
import { extractTags } from "@/services/programs.service";
import { handleApiError } from "@/lib/api-utils";
import { useAuth } from "@/hooks/useAuth";

/**
 * The bank, all content types.
 *
 * Deliberately the same shape as `usePrograms` — the page it replaces reads
 * `{ programs, tags, loading, error, refetch }` in a dozen places, and changing
 * the contract at the same time as changing what it returns would make the diff
 * impossible to review.
 */
type UseContentResult = {
  content: ContentItem[] | null;
  tags: string[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export default function useContent(workspaceId: string | null): UseContentResult {
  const { getToken } = useAuth();
  const [content, setContent] = useState<ContentItem[] | null>(null);
  const [tags, setTags] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadContent = useCallback(async () => {
    if (!workspaceId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchContent(workspaceId, getToken);
      setContent(data);
      setTags(extractTags(data));
    } catch (err) {
      const errorMessage = handleApiError(err, "Failed to fetch content");
      setError(new Error(errorMessage));
      setContent([]);
      setTags([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, getToken]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  return { content, tags, loading, error, refetch: loadContent };
}

export type { ContentItem };
