"use client";

import { useEffect, useState } from "react";
import { useDefaultWorkspaceId } from "@/hooks/useDefaultWorkspaceId";
import { useSeasons, usePlanGrid } from "@/hooks/usePlan";
import PlanCalendar from "./PlanCalendar";
import PlanGrid from "./PlanGrid";
import PlanTimeline from "./PlanTimeline";
import PlanWindow from "./PlanWindow";
import SeasonSwitcher from "./SeasonSwitcher";
import styles from "./PlanShell.module.css";

/**
 * The plan route (A1, sc-34) — one shared home for the whole plan.
 *
 * A1 is the spine the rest of cluster A hangs off: it owns the season, and the
 * views are projections of that one selection. ADR-002 §2 requires the grid
 * (A2), the per-flokkur timeline and the month calendar (A4) to be renderings
 * of a single dataset rather than separate tools, so they mount *inside* this
 * shell and read the same `usePlan` query. Nothing below fetches for itself.
 */

/** The three projections ADR-002 §2 requires. Timeline first, per the roadmap. */
const VIEWS = [
  { id: "window", label: "Næstu fundir", ticket: "A7 (sc-42)" },
  { id: "timeline", label: "Tímalína", ticket: "A4 (sc-39)" },
  { id: "grid", label: "Tafla", ticket: "A2 (sc-37)" },
  { id: "calendar", label: "Dagatal", ticket: "A4 (sc-39)" },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

export default function PlanShell() {
  const workspaceId = useDefaultWorkspaceId();
  const { seasons, isLoading: seasonsLoading, error } = useSeasons(workspaceId);
  // The workspace id resolves in an effect, so counting "not resolved yet" as
  // loading stops the page telling every visitor they have no starfsár before
  // it has asked. It is bounded, though: useDefaultWorkspaceId swallows its
  // failures and returns null for ever, and an unbounded spinner is its own
  // kind of lie.
  const [workspaceTimedOut, setWorkspaceTimedOut] = useState(false);
  useEffect(() => {
    if (workspaceId) return;
    const timer = setTimeout(() => setWorkspaceTimedOut(true), 8000);
    return () => clearTimeout(timer);
  }, [workspaceId]);

  const workspaceMissing = workspaceId === null && workspaceTimedOut;
  const isLoading = (seasonsLoading && workspaceId !== null) || (!workspaceId && !workspaceMissing);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<ViewId>("window");
  // One query per season, shared by every view — ADR-002 §2 requires the views
  // to be projections of one dataset, which only holds if they share a fetch.
  const { grid, isLoading: gridLoading, error: gridError } = usePlanGrid(selectedId);

  // Land on the newest starfsár once seasons arrive, so the route is never a
  // blank chooser when there is an obvious thing to be looking at.
  useEffect(() => {
    if (seasons.length === 0) return;
    // Re-select whenever the current choice is gone, not only when it was never
    // made: refetchOnWindowFocus is on precisely because co-leaders edit in
    // other tabs, so the selected season can vanish under us.
    const stillThere = seasons.some((season) => season.id === selectedId);
    if (!stillThere) setSelectedId(seasons[0].id);
  }, [seasons, selectedId]);

  const selected = seasons.find((s) => s.id === selectedId) ?? null;

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>Vinnubekkurinn</h1>
        <p className={styles.subtitle}>
          Sameiginlegt heimili dagskrárinnar — starfsár, hringir og fundir á einum stað.
        </p>
      </header>

      <SeasonSwitcher seasons={seasons} selectedId={selectedId} onSelect={setSelectedId} />

      {seasons.length > 0 && (
        <div className={styles.viewBar} role="group" aria-label="Sýn">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={view === v.id}
              className={`${styles.viewTab} ${view === v.id ? styles.viewSelected : ""}`}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <div className={styles.content}>
        {isLoading && <p className={styles.muted}>Sæki starfsár…</p>}

        {workspaceMissing && (
          <div className={styles.error} role="alert">
            <strong>Náði ekki í vinnusvæðið.</strong> Dagskráin getur ekki hlaðist án þess — prófaðu
            að endurhlaða síðuna.
          </div>
        )}

        {error && (
          <div className={styles.error} role="alert">
            Ekki tókst að sækja starfsárin. Grunnurinn gæti verið í smíðum.
          </div>
        )}

        {!isLoading && !workspaceMissing && !error && seasons.length === 0 && (
          <div className={styles.notice}>
            <h2 className={styles.noticeTitle}>Ekkert starfsár enn</h2>
            <p>
              Þegar starfsár hefur verið stofnað birtist dagskráin hér — vikur, flokkar og fundir.
            </p>
          </div>
        )}

        {selected && (
          <section aria-live="polite">
            {gridLoading && <p className={styles.muted}>Sæki dagskrána…</p>}

            {gridError && !gridLoading && (
              <div className={styles.error} role="alert">
                Ekki tókst að sækja dagskrána fyrir {selected.name}. Grunnurinn gæti verið í smíðum.
              </div>
            )}

            {grid && view === "window" && <PlanWindow key={grid.season_id} data={grid} />}
            {grid && view === "grid" && <PlanGrid data={grid} />}
            {grid && view === "timeline" && <PlanTimeline key={grid.season_id} data={grid} />}
            {grid && view === "calendar" && <PlanCalendar key={grid.season_id} data={grid} />}

            {!gridLoading && !grid && !gridError && (
              <p className={styles.muted}>Ekkert skráð á {selected.name} enn.</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
