"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  compareSeasons,
  createSeason,
  getSeasonGrid,
  getSeasons,
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
  grid: (seasonId: string) => ["plan", "grid", seasonId] as const,
};

export function useSeasons(workspaceId: string | null) {
  const { getToken } = useAuth();

  const query = useQuery({
    queryKey: planKeys.seasons(workspaceId ?? "none"),
    enabled: Boolean(workspaceId),
    queryFn: () => getSeasons(workspaceId as string, getToken),
    // A missing endpoint is a deployment fact, not a blip — retrying just
    // delays the empty state the shell is going to show anyway.
    retry: 1,
  });

  const seasons = useMemo(() => [...(query.data ?? [])].sort(compareSeasons), [query.data]);

  return {
    seasons,
    // `isPending`, not `isLoading`: v5 derives isLoading as isPending &&
    // isFetching, which is false on the single render where a query flips from
    // disabled to enabled — long enough to flash "you have no starfsár".
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useCreateSeason(workspaceId: string | null) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<SeasonCreate, "workspace_id">) => {
      // The workspace id resolves asynchronously, and it is interpolated
      // straight into the URL — without this a call made too early POSTs to
      // /workspaces/null/seasons and 404s for a reason nobody can read.
      if (!workspaceId) {
        return Promise.reject(new Error("Workspace is not resolved yet"));
      }
      return createSeason({ ...payload, workspace_id: workspaceId }, getToken);
    },
    onSuccess: (created: Season) => {
      queryClient.setQueryData<Season[]>(planKeys.seasons(created.workspace_id), (previous) =>
        previous ? [...previous, created] : [created]
      );
    },
  });
}

/**
 * The week×flokkur matrix for a season (A2, sc-37).
 *
 * Keyed by season, so switching seasons in the shell swaps the whole grid
 * without the views needing to know that happened.
 */
export function usePlanGrid(seasonId: string | null) {
  const { getToken } = useAuth();

  const query = useQuery({
    queryKey: planKeys.grid(seasonId ?? "none"),
    enabled: Boolean(seasonId),
    queryFn: () => getSeasonGrid(seasonId as string, getToken),
    retry: 1,
  });

  return {
    grid: query.data ?? null,
    isLoading: query.isPending,
    error: query.error,
  };
}
