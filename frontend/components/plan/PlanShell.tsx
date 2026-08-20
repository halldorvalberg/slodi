"use client";

import { useEffect, useState } from "react";
import { useDefaultWorkspaceId } from "@/hooks/useDefaultWorkspaceId";
import { useSeasons } from "@/hooks/usePlan";
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
  { id: "timeline", label: "Tímalína", ticket: "A4 (sc-39)" },
  { id: "grid", label: "Tafla", ticket: "A2 (sc-37)" },
  { id: "calendar", label: "Dagatal", ticket: "A4 (sc-39)" },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

export default function PlanShell() {
  const workspaceId = useDefaultWorkspaceId();
  const { seasons, isLoading, isUnavailable, error } = useSeasons(workspaceId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<ViewId>("timeline");

  // Land on the newest starfsár once seasons arrive, so the route is never a
  // blank chooser when there is an obvious thing to be looking at.
  useEffect(() => {
    if (!selectedId && seasons.length > 0) setSelectedId(seasons[0].id);
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
        <div className={styles.viewBar} role="tablist" aria-label="Sýn">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              className={`${styles.viewTab} ${view === v.id ? styles.viewSelected : ""}`}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <main className={styles.content}>
        {isLoading && <p className={styles.muted}>Sæki starfsár…</p>}

        {isUnavailable && (
          <div className={styles.notice}>
            <h2 className={styles.noticeTitle}>Bakendinn er ekki tilbúinn enn</h2>
            <p>
              Skipulagsgrunnurinn (<code>Season</code>) er í smíðum. Þessi síða birtir raunveruleg
              gögn um leið og hann er kominn — ekkert þarf að breytast hér.
            </p>
          </div>
        )}

        {error && !isUnavailable && (
          <div className={styles.error} role="alert">
            Ekki tókst að sækja starfsárin.
          </div>
        )}

        {!isLoading && !isUnavailable && !error && seasons.length === 0 && (
          <div className={styles.notice}>
            <h2 className={styles.noticeTitle}>Ekkert starfsár enn</h2>
            <p>Búðu til starfsár til að byrja að skipuleggja, eða krot til að prófa þig áfram.</p>
          </div>
        )}

        {selected && (
          <section className={styles.viewHost} aria-live="polite">
            {/* The views themselves are A2 and A4. This shell owns the season
                selection and the switching; the renderers mount here and read
                the same query, so they never diverge from one another. */}
            <p className={styles.muted}>
              {VIEWS.find((v) => v.id === view)?.label} fyrir <strong>{selected.name}</strong> kemur
              með {VIEWS.find((v) => v.id === view)?.ticket}.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
