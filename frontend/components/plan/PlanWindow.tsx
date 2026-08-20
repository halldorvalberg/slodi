"use client";

import { useMemo, useState } from "react";
import type { PlanCell, PlanGrid as PlanGridData, PlanWeek } from "@/services/plan.service";
import styles from "./PlanWindow.module.css";

/**
 * The rolling working window — one flokkur, the next few fundir (A7, sc-42).
 *
 * A flokksforingi does not plan a year; they plan the next handful of meetings,
 * which is what the paper "Fundarhugmyndir" sheet is for. This is that horizon:
 * a little done behind for context, the skeleton ahead to fill in.
 *
 * It reads the same `PlanGrid` the grid view does and filters it — no second
 * fetch and no second shape. That is ADR-002 §2's "projections of one dataset"
 * being literally true rather than merely intended.
 */

/** Meetings kept behind the current one, for context. */
const DONE_CONTEXT = 1;
const DEFAULT_AHEAD = 4;

interface Props {
  data: PlanGridData;
  /** Injectable so tests are not tied to the day they run. */
  today?: Date;
  ahead?: number;
}

type WindowEntry = {
  cell: PlanCell;
  week: PlanWeek;
  isDone: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * A week counts as done once it is over, not once it has begun.
 *
 * `starts_on` is the Monday, but the fundur is usually midweek — comparing
 * against the start would grey out on Monday morning the very meeting the
 * leader opened the planner to prepare for.
 *
 * An undated week — a scratchpad — is never done: there is no date to be past,
 * and marking it done would make a scratchpad look like a finished term.
 */
function isWeekDone(week: PlanWeek, today: Date): boolean {
  if (!week.starts_on) return false;
  return new Date(week.starts_on).getTime() + 7 * DAY_MS <= today.getTime();
}

export default function PlanWindow({ data, today, ahead = DEFAULT_AHEAD }: Props) {
  // A default of `new Date()` in the parameter list is a new object on every
  // render, which invalidates every memo below it. Day granularity is all the
  // done/ahead split needs, and it is stable across a day's renders.
  const now = useMemo(() => today ?? new Date(), [today]);

  const [patrolId, setPatrolId] = useState<string | null>(data.patrols[0]?.id ?? null);

  // Finding from review: the shell swaps `data` when the season changes without
  // remounting, so a patrol id from the previous season would survive and match
  // nothing — an empty window and a select with no option chosen.
  const activePatrolId =
    patrolId && data.patrols.some((patrol) => patrol.id === patrolId)
      ? patrolId
      : (data.patrols[0]?.id ?? null);

  const weekByIndex = useMemo(() => {
    const byIndex = new Map<number, PlanWeek>();
    for (const week of data.weeks) byIndex.set(week.index, week);
    return byIndex;
  }, [data.weeks]);

  const entries = useMemo<WindowEntry[]>(() => {
    if (!activePatrolId) return [];
    return data.cells
      .filter((cell) => cell.patrol_id === activePatrolId)
      .map((cell) => {
        const week = weekByIndex.get(cell.week_index);
        return week ? { cell, week, isDone: isWeekDone(week, now) } : null;
      })
      .filter((entry): entry is WindowEntry => entry !== null)
      .sort((a, b) => a.week.index - b.week.index);
  }, [data.cells, activePatrolId, weekByIndex, now]);

  /**
   * Keep a little history and the next few ahead. Slicing around the first
   * not-yet-done meeting rather than around today's date means an undated
   * scratchpad still shows its first few, instead of an empty window.
   */
  const windowed = useMemo(() => {
    const firstUpcoming = entries.findIndex((entry) => !entry.isDone);
    if (firstUpcoming === -1) return entries.slice(-DONE_CONTEXT - ahead);
    const from = Math.max(0, firstUpcoming - DONE_CONTEXT);
    return entries.slice(from, firstUpcoming + ahead);
  }, [entries, ahead]);

  if (data.patrols.length === 0) {
    return <p className={styles.empty}>Engir flokkar til að sýna enn.</p>;
  }

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <label className={styles.label} htmlFor="plan-window-patrol">
          Flokkur
        </label>
        <select
          id="plan-window-patrol"
          className={styles.select}
          value={activePatrolId ?? ""}
          onChange={(event) => setPatrolId(event.target.value)}
        >
          {data.patrols.map((patrol) => (
            <option key={patrol.id} value={patrol.id}>
              {patrol.name}
            </option>
          ))}
        </select>
      </div>

      {windowed.length === 0 ? (
        <p className={styles.empty}>Engir fundir framundan hjá þessum flokki.</p>
      ) : (
        <ol className={styles.list}>
          {windowed.map(({ cell, week, isDone }) => (
            <li
              key={cell.event_id}
              className={`${styles.item} ${isDone ? styles.done : styles.ahead}`}
            >
              <span className={styles.week}>{week.label}</span>
              <span className={styles.title}>{cell.title}</span>
              {cell.status === "unknown" && (
                <span className={styles.mark} aria-label="Óákveðið">
                  ?
                </span>
              )}
              {isDone && <span className={styles.doneTag}>Búið</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
