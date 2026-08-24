import { useState, useEffect } from "react";
// `/content/{id}` rather than `/programs/{id}`: the detail page has to resolve
// a task or an event as well, and after the reclassify every existing bank item
// is a task — the programmes-only endpoint would 404 on all of them.
import { fetchContentById, type ContentItem } from "@/services/content.service";
import { useAuth } from "@/hooks/useAuth";

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function useProgram(id: string) {
  const { getToken } = useAuth();
  const [program, setProgram] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadContent() {
      if (!isValidUUID(id)) {
        setError(new Error("Invalid content ID format"));
        setProgram(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchContentById(id, getToken);
        setProgram(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setProgram(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [id, getToken]);

  return { program, isLoading, error, setProgram };
}
