"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  compareSeasons,
  createSeason,
  getSeasons,
  SeasonsUnavailable,
  type Season,
  type SeasonCreate,
} from "@/services/plan.service";

/**
 * The single source the plan views read from (A1, sc-34).
 *
 * ADR-002 §2 is explicit that the grid, the per-flokkur timeline and the month
 * calendar are *projections of one dataset*, not separate tools. That only holds
 * if they share a fetch, so every A-cluster view is meant to hang off this hook
 * rather than call the service itself.
 */

export const planKeys = {
  seasons: (workspaceId: string) => ["plan", "seasons", workspaceId] as const,
};

export function useSeasons(workspaceId: string | null) {
  const { getToken } = useAuth();

  const query = useQuery({
    queryKey: planKeys.seasons(workspaceId ?? "none"),
    enabled: Boolean(workspaceId),
    queryFn: () => getSeasons(workspaceId as string, getToken),
    // A missing endpoint is a deployment fact, not a blip — retrying just
    // delays the empty state the shell is going to show anyway.
    retry: (failureCount, error) => !(error instanceof SeasonsUnavailable) && failureCount < 2,
  });

  const seasons = useMemo(() => [...(query.data ?? [])].sort(compareSeasons), [query.data]);

  return {
    seasons,
    isLoading: query.isLoading,
    /** True while the backend half of A1 is still to land. */
    isUnavailable: query.error instanceof SeasonsUnavailable,
    error: query.error instanceof SeasonsUnavailable ? null : query.error,
    refetch: query.refetch,
  };
}

export function useCreateSeason(workspaceId: string | null) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<SeasonCreate, "workspace_id">) =>
      createSeason({ ...payload, workspace_id: workspaceId as string }, getToken),
    onSuccess: (created: Season) => {
      queryClient.setQueryData<Season[]>(planKeys.seasons(created.workspace_id), (previous) =>
        previous ? [...previous, created] : [created]
      );
    },
  });
}
