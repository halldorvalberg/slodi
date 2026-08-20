"use client";

import { Fragment, useMemo, useState } from "react";
import type { PlanGrid as PlanGridData, PlanWeek } from "@/services/plan.service";
import { parseWeekStart } from "./planEntries";
import styles from "./PlanCalendar.module.css";

/**
 * The month view (A4, sc-39) — the shared artifact A5 builds on.
 *
 * ## Why entries sit in a week, not on a day
 *
 * The grid contract carries `week_index` for every entry and `starts_on` for
 * every week. It does not carry a date per event. So the honest granularity here
 * is the week: placing a Saturday útilega on its week's Monday because that is
 * the only date available would be inventing information the planner does not
 * have, and a leader setting dates around this calendar would be misled.
 *
 * The day grid is drawn for orientation — which weeks a month contains, where
 * they fall — and each week's entries are listed against it. A true day-level
 * calendar needs an event date in the contract; that is noted in
 * docs/frontend/plan-api-contract.md rather than guessed at here.
 *
 * `Intl.DateTimeFormat` gives Icelandic month and weekday names without a date
 * library.
 */

const monthTitleFormatter = new Intl.DateTimeFormat("is-IS", { month: "long", year: "numeric" });

/** Mánudagur-first, which is how an Icelandic week reads. */
const WEEKDAYS = ["Mán", "Þri", "Mið", "Fim", "Fös", "Lau", "Sun"];

interface Props {
  data: PlanGridData;
  /** Injectable so tests do not depend on the day they run. */
  today?: Date;
}

type MonthKey = string;

function monthKeyOf(date: Date): MonthKey {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default function PlanCalendar({ data, today }: Props) {
  const now = useMemo(() => today ?? new Date(), [today]);

  /** Weeks that carry a date, grouped by the month their Monday falls in. */
  const months = useMemo(() => {
    const byMonth = new Map<MonthKey, { start: Date; weeks: PlanWeek[] }>();
    for (const week of data.weeks) {
      const start = parseWeekStart(week);
      if (!start) continue;
      const key = monthKeyOf(start);
      const bucket = byMonth.get(key);
      if (bucket) bucket.weeks.push(week);
      else byMonth.set(key, { start, weeks: [week] });
    }
    return [...byMonth.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [data.weeks]);

  const [monthIndex, setMonthIndex] = useState(() => {
    const current = months.findIndex(([key]) => key === monthKeyOf(now));
    return current >= 0 ? current : 0;
  });

  const entriesByWeek = useMemo(() => {
    const byWeek = new Map<number, { id: string; title: string; troopWide: boolean }[]>();
    const push = (weekIndex: number, entry: { id: string; title: string; troopWide: boolean }) => {
      const list = byWeek.get(weekIndex) ?? [];
      list.push(entry);
      byWeek.set(weekIndex, list);
    };
    // Every patrol's meetings, not one — this is the whole-troop view.
    for (const band of data.bands) {
      push(band.week_index, { id: band.event_id, title: band.title, troopWide: true });
    }
    for (const cell of data.cells) {
      push(cell.week_index, { id: cell.event_id, title: cell.title, troopWide: false });
    }
    return byWeek;
  }, [data.bands, data.cells]);

  if (months.length === 0) {
    return (
      <p className={styles.empty}>
        Þetta starfsár hefur engar dagsettar vikur, svo ekkert dagatal er hægt að teikna. Krot er
        ódagsett — notaðu tímalínuna fyrir það.
      </p>
    );
  }

  const safeIndex = Math.min(monthIndex, months.length - 1);
  const [, month] = months[safeIndex];

  return (
    <div className={styles.root}>
      <div className={styles.bar}>
        <button
          type="button"
          className={styles.nav}
          onClick={() => setMonthIndex((i) => Math.max(0, i - 1))}
          disabled={safeIndex === 0}
        >
          ← Fyrri
        </button>
        <h3 className={styles.monthTitle}>{monthTitleFormatter.format(month.start)}</h3>
        <button
          type="button"
          className={styles.nav}
          onClick={() => setMonthIndex((i) => Math.min(months.length - 1, i + 1))}
          disabled={safeIndex === months.length - 1}
        >
          Næsti →
        </button>
      </div>

      <table className={styles.table}>
        <caption className={styles.caption}>
          Dagar til viðmiðunar; viðburðir eru skráðir á viku, ekki á dag
        </caption>
        <thead>
          <tr>
            {WEEKDAYS.map((day) => (
              <th key={day} scope="col" className={styles.dayHead}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {month.weeks.map((week) => {
            const start = parseWeekStart(week) as Date;
            const entries = entriesByWeek.get(week.index) ?? [];
            return (
              <Fragment key={week.index}>
                <tr className={styles.week}>
                  {WEEKDAYS.map((_, offset) => {
                    const day = new Date(
                      start.getFullYear(),
                      start.getMonth(),
                      start.getDate() + offset
                    );
                    const isToday = day.toDateString() === now.toDateString();
                    return (
                      <td key={offset} className={`${styles.day} ${isToday ? styles.today : ""}`}>
                        <span className={styles.dayNumber}>{day.getDate()}</span>
                      </td>
                    );
                  })}
                </tr>
                {entries.length > 0 && (
                  <tr>
                    {/* Spanning the week rather than sitting in a day cell: the
                        contract carries no date per event, and dropping one into
                        Monday would invent a day the planner does not know. */}
                    <td colSpan={WEEKDAYS.length} className={styles.entriesRow}>
                      <ul className={styles.entries}>
                        {entries.map((entry) => (
                          <li
                            key={entry.id}
                            className={entry.troopWide ? styles.troopWide : styles.entry}
                          >
                            {entry.title}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
