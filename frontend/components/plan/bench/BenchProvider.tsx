"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import type { PlanBenchData } from "@/services/plan.service";
import { benchReducer, initialBenchState, type BenchIntent, type BenchState } from "./benchState";

/**
 * sc-161 `AssemblyProvider` — one state, every path.
 *
 * The bench and the block rail are siblings in the layout but they change the
 * same thing: "Bæta við" in the rail and ▲/▼ in a row are both edits to one
 * fundur. Holding that state above both is what lets the rail add a block
 * without the two components reaching into each other, and it is the seam
 * dnd-kit will later dispatch through as well rather than owning any state of
 * its own (SPEC §5 step 3).
 */

type BenchContextValue = {
  state: BenchState;
  dispatch: (intent: BenchIntent) => void;
};

const BenchContext = createContext<BenchContextValue | null>(null);

export function BenchProvider({ data, children }: { data: PlanBenchData; children: ReactNode }) {
  const [state, dispatch] = useReducer(benchReducer, data, initialBenchState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <BenchContext.Provider value={value}>{children}</BenchContext.Provider>;
}

/**
 * Null outside a provider rather than throwing.
 *
 * The rail renders even when no season is loaded and there is nothing to add to
 * — it is still worth reading the bank. Throwing would make "no fundur yet" an
 * error instead of a state, and the rail already has a disabled-add path for it.
 */
export function useBench(): BenchContextValue | null {
  return useContext(BenchContext);
}
