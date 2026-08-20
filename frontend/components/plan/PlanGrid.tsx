"use client";

import { useMemo } from "react";
import {
  cellKey,
  coveredWeeks,
  indexCells,
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

  const cellIndex = useMemo(() => indexCells(cells), [cells]);
  const bandByWeek = useMemo(() => {
    const byWeek = new Map<number, PlanBand>();
    for (const band of bands) byWeek.set(band.week_index, band);
    return byWeek;
  }, [bands]);

  /**
   * Positions already occupied by something spanning into them from above.
   * Without this a rowSpan and the cell beneath it would both render and the
   * row would grow an extra column.
   */
  const occupied = useMemo(() => {
    const taken = new Set<string>();
    for (const cell of cells) {
      for (const week of coveredWeeks(cell)) taken.add(cellKey(week, cell.patrol_id));
    }
    return taken;
  }, [cells]);

  const bandCoveredWeeks = useMemo(() => {
    const taken = new Set<number>();
    for (const band of bands) for (const week of coveredWeeks(band)) taken.add(week);
    return taken;
  }, [bands]);

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
            const band = bandByWeek.get(week.index);

            // A troop-wide event takes the whole row: that is what stops
            // parallel flokksfundir being drawn during a útilega.
            if (band) {
              return (
                <tr key={week.index} className={styles.bandRow}>
                  <th scope="row" className={styles.weekHead}>
                    {week.label}
                  </th>
                  <td colSpan={patrols.length} className={styles.bandCell}>
                    <EntryButton entry={band} onSelect={onSelectEvent} />
                  </td>
                </tr>
              );
            }

            // Covered by a band spanning down from an earlier week.
            if (bandCoveredWeeks.has(week.index)) {
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
                  if (occupied.has(key)) return null;

                  const cell = cellIndex.get(key);
                  const span = cell ? Math.max(1, cell.span_weeks) : 1;

                  return (
                    <td
                      key={patrol.id}
                      className={styles.cell}
                      rowSpan={span > 1 ? span : undefined}
                    >
                      {cell ? (
                        <EntryButton entry={cell} onSelect={onSelectEvent} />
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
