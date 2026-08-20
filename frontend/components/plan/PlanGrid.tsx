"use client";

import { useMemo } from "react";
import {
  cellKey,
  type PlanBand,
  type PlanCell,
  type PlanGrid as PlanGridData,
} from "@/services/plan.service";
import styles from "./PlanGrid.module.css";

/**
 * The dagskrárhringur as a grid — weeks down, flokkar across (A2, sc-37).
 *
 * ## Why a real <table>, and no table library
 *
 * The ticket asks for a build-vs-library decision. This is built, because the
 * two hard parts are spanning, and spanning is what a table already does:
 *
 *   - a troop-wide event is one `colSpan` across every patrol column;
 *   - a multi-week element is one `rowSpan` down several weeks.
 *
 * `@tanstack/react-table` is a headless *data* table — sorting, filtering,
 * columns derived from rows. It has no spanning primitive, so the cells would
 * still be hand-rendered, and the grid is a fixed matrix rather than a data
 * table. `@dnd-kit` belongs to the Vinnubekkurinn block-assembly surface
 * (sc-138/143/160), which owns dragging; pulling it in here would pre-empt it.
 *
 * A semantic table also gets screen-reader row and column context for free from
 * `<th scope>`. The equivalent div grid would need a full ARIA grid.
 */

interface Props {
  data: PlanGridData;
  onSelectEvent?: (eventId: string) => void;
}

const STATUS_CLASS: Record<PlanCell["status"], string> = {
  unknown: styles.statusUnknown,
  tentative: styles.statusTentative,
  draft: styles.statusDraft,
  confirmed: styles.statusConfirmed,
};

/** The "?" of ADR-002 §3 — refined further by A8. */
function StatusMark({ status }: { status: PlanCell["status"] }) {
  if (status !== "unknown") return null;
  return (
    <span className={styles.mark} aria-label="Óákveðið">
      ?
    </span>
  );
}

function EntryButton({
  entry,
  onSelect,
}: {
  entry: PlanBand | PlanCell;
  onSelect?: (eventId: string) => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.entry} ${STATUS_CLASS[entry.status]}`}
      onClick={() => onSelect?.(entry.event_id)}
    >
      <span className={styles.entryTitle}>{entry.title}</span>
      <StatusMark status={entry.status} />
    </button>
  );
}

export default function PlanGrid({ data, onSelectEvent }: Props) {
  const { patrols, weeks, bands, cells } = data;

  /**
   * A band takes the whole week: a troop-wide event means every flokkur is on
   * it, so per-flokkur cells cannot coexist with one. That is what makes the
   * layout tractable — the alternative is placing a band into whatever columns
   * a spanning cell has left free, which the HTML table model cannot express as
   * one cell unless those columns happen to be contiguous and at an edge.
   *
   * So spans are *clipped* at the next band instead, and any cell that lands
   * inside a band's weeks is reported on the band rather than silently dropped.
   */
  const layout = useMemo(() => {
    const bandStart = new Map<number, PlanBand>();
    for (const band of bands) bandStart.set(band.week_index, band);

    const bandWeeks = new Set<number>();
    for (const band of bands) {
      for (let offset = 0; offset < Math.max(1, band.span_weeks); offset++) {
        bandWeeks.add(band.week_index + offset);
      }
    }

    /** How far a cell may span before it would run into a band. */
    const clippedSpan = (cell: PlanCell): number => {
      const wanted = Math.max(1, cell.span_weeks);
      for (let offset = 1; offset < wanted; offset++) {
        if (bandWeeks.has(cell.week_index + offset)) return offset;
      }
      return wanted;
    };

    const placed = new Map<string, { cell: PlanCell; span: number }>();
    const covered = new Set<string>();
    const swallowed = new Map<number, PlanCell[]>();

    for (const cell of cells) {
      if (bandWeeks.has(cell.week_index)) {
        // Inside a band's weeks. Surfaced on the band so it is visible.
        const bandWeek = [...bandStart.keys()]
          .filter((week) => week <= cell.week_index)
          .sort((a, b) => b - a)[0];
        const list = swallowed.get(bandWeek) ?? [];
        list.push(cell);
        swallowed.set(bandWeek, list);
        continue;
      }
      const span = clippedSpan(cell);
      placed.set(cellKey(cell.week_index, cell.patrol_id), { cell, span });
      for (let offset = 1; offset < span; offset++) {
        covered.add(cellKey(cell.week_index + offset, cell.patrol_id));
      }
    }

    return { bandStart, bandWeeks, placed, covered, swallowed };
  }, [bands, cells]);

  if (patrols.length === 0 || weeks.length === 0) {
    return (
      <p className={styles.empty}>
        Þessi hringur hefur hvorki flokka né vikur enn — bættu við flokkum til að byrja töfluna.
      </p>
    );
  }

  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <caption className={styles.caption}>
          Dagskrárhringur — vikur niður, flokkar til hliðar
        </caption>
        <thead>
          <tr>
            <th scope="col" className={styles.cornerHead}>
              Vika
            </th>
            {patrols.map((patrol) => (
              <th key={patrol.id} scope="col" className={styles.patrolHead}>
                {patrol.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => {
            const band = layout.bandStart.get(week.index);

            if (band) {
              const hidden = layout.swallowed.get(week.index) ?? [];
              return (
                <tr key={week.index} className={styles.bandRow}>
                  <th scope="row" className={styles.weekHead}>
                    {week.label}
                  </th>
                  <td
                    colSpan={patrols.length}
                    rowSpan={Math.max(1, band.span_weeks)}
                    className={styles.bandCell}
                  >
                    <EntryButton entry={band} onSelect={onSelectEvent} />
                    {hidden.length > 0 && (
                      <p className={styles.swallowed}>
                        {hidden.length} flokkafundur á sama tíma — opnaðu vikuna til að sjá
                      </p>
                    )}
                  </td>
                </tr>
              );
            }

            // A week under a band the previous row is spanning into.
            if (layout.bandWeeks.has(week.index)) {
              return (
                <tr key={week.index} className={styles.bandRow}>
                  <th scope="row" className={styles.weekHead}>
                    {week.label}
                  </th>
                </tr>
              );
            }

            return (
              <tr key={week.index}>
                <th scope="row" className={styles.weekHead}>
                  {week.label}
                </th>
                {patrols.map((patrol) => {
                  const key = cellKey(week.index, patrol.id);
                  if (layout.covered.has(key)) return null;

                  const entry = layout.placed.get(key);
                  return (
                    <td
                      key={patrol.id}
                      className={styles.cell}
                      rowSpan={entry && entry.span > 1 ? entry.span : undefined}
                    >
                      {entry ? (
                        <EntryButton entry={entry.cell} onSelect={onSelectEvent} />
                      ) : (
                        <span className={styles.blank} aria-hidden="true" />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
