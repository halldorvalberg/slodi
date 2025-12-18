"use client";

import { useCallback, useEffect, useState } from "react";

export type Program = {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
};

type UseProgramsResult = {
  programs: Program[] | null;
  tags: string[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

const DEFAULT_BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000") : "http://localhost:8000";

export default function usePrograms(endpoint = "/programs"): UseProgramsResult {
  const [programs, setPrograms] = useState<Program[] | null>(null);
  const [tags, setTags] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || DEFAULT_BASE;
      const url = new URL(endpoint, base).toString();
      const res = await fetch(url, { method: "GET", credentials: "include" });
      if (!res.ok) throw new Error(`Failed to fetch programs: ${res.status} ${res.statusText}`);
      const data = await res.json();

      // Accept either an array or an object with `{ programs: Program[] }`
      const list: Program[] = Array.isArray(data) ? data : data.programs || [];
      setPrograms(list);
      setTags(Array.from(new Set(list.flatMap((p) => p.tags || []))));
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setPrograms([]);
      setTags([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return { programs, tags, loading, error, refetch: fetchPrograms };
}
