"use client";

import { useRef, useState } from "react";
import { BAND_KIND, type BandId, type Fundur, type Patrol } from "@/services/plan.service";
import { accentVarFor } from "../planEntries";
import { MIN_MINUTES, bandMinutes, bandOffset, clockAt, type BenchIntent } from "./benchState";
import styles from "./split.module.css";

/**
 * A band split across the flokkar — time down the side, one column per patrol.
 *
 * ## Why this is a grid and not three lists
 *
 * The lanes run *at the same time*. The sveit splits up, each flokkur does its
 * own thing for the same stretch of clock, and they reconvene. A list per
 * flokkur would render that as three things happening in sequence, which is the
 * opposite of what is happening — and it would give a leader no way to see the
 * thing they actually need to see, which is whether one flokkur is going to be
 * standing around while another is still working.
 *
 * So time is the constant on the Y axis for the whole section, blocks are
 * positioned by their offset, and the empty tail of a short lane is drawn as
 * "N mín laus" rather than left blank. The band ends when the *longest* lane
 * ends — "lengsti flokkur ræður" — because that is when everyone can regroup.
 *
 * ## Moving a verkefni between flokkar
 *
 * Three ways, all dispatching the same `laneMoveAcross` intent (SPEC §0: drag
 * is an accelerator, never the only path):
 *
 * - **drag** a block into another column, dropped at the time you release it;
 * - **← →** on a focused block, which moves it one flokkur sideways;
 * - the **← →** buttons that appear on the selected block.
 *
 * The drag is the browser's own HTML5 drag-and-drop rather than a library. It
 * is enough for one grid of absolutely-positioned blocks, and it keeps the
 * dnd-kit decision (SPEC §5) unmade until the canvas actually needs it.
 */

/** Pixels per minute. Tall enough that a 15-minute block is still readable. */
const PX_PER_MIN = 4;
const TICK_MINUTES = 15;
/** Below this a block only has room for its title. */
const TIGHT_MINUTES = 20;

interface Props {
  fundur: Fundur;
  band: BandId;
  patrols: Patrol[];
  selected: string | null;
  dispatch: (intent: BenchIntent) => void;
}

function laneMinutes(items: { minutes: number }[]): number {
  return items.reduce((sum, item) => sum + item.minutes, 0);
}

type Dragging = { laneIndex: number; id: string };

export default function SplitGrid({ fundur, band, patrols, selected, dispatch }: Props) {
  const [dragging, setDragging] = useState<Dragging | null>(null);
  const [overLane, setOverLane] = useState<number | null>(null);
  const laneRefs = useRef(new Map<number, HTMLDivElement>());

  const lanes = fundur.split?.[band];
  if (!lanes || lanes.length === 0) return null;

  const offset = bandOffset(fundur, band);
  const duration = bandMinutes(fundur, band);
  const height = Math.max(duration, TICK_MINUTES) * PX_PER_MIN;

  const ticks: number[] = [];
  for (let m = 0; m <= duration; m += TICK_MINUTES) ticks.push(m);

  /**
   * Which slot a drop at this Y lands in.
   *
   * Measured against the running total of the target lane rather than the
   * clock, because the lanes do not share a row grid — a block released level
   * with 17:40 belongs after whatever that flokkur is doing at 17:40, which is
   * not necessarily the same block the neighbouring column has there.
   */
  const dropIndexFor = (laneIndex: number, clientY: number): number => {
    const node = laneRefs.current.get(laneIndex);
    const lane = lanes[laneIndex];
    if (!node || !lane) return 0;
    const y = clientY - node.getBoundingClientRect().top;
    let running = 0;
    for (let i = 0; i < lane.items.length; i++) {
      running += lane.items[i].minutes;
      if (y < running * PX_PER_MIN) return i;
    }
    return lane.items.length;
  };

  /**
   * The flokkur in a given lane.
   *
   * Resolved through the lane's own `patrol_id` rather than by indexing
   * `patrols` at the lane position. They agree today because `splitBand` deals
   * lanes out in patrol order, but the moment lanes come from the backend — or
   * a flokkur is removed — an index-based label would name the wrong flokkur,
   * and a label that lies is worse than the generic fallback.
   */
  const nameOfLane = (index: number): string => {
    const lane = lanes[index];
    if (!lane) return "annars flokks";
    return patrols.find((patrol) => patrol.id === lane.patrol_id)?.name ?? "annars flokks";
  };

  /**
   * A lane's flokkur, and the column index its colour comes from.
   *
   * The colour index is the patrol's position in `patrols`, not the lane's —
   * the Rist and the Dagatal both derive it that way, and a flokkur with no
   * declared accent has to land on the same ramp in all three or the whole
   * point of colouring them is lost.
   */
  const flokkurOf = (laneIndex: number) => {
    const laneId = lanes[laneIndex]?.patrol_id;
    const at = patrols.findIndex((patrol) => patrol.id === laneId);
    return { patrol: at >= 0 ? patrols[at] : undefined, colourIndex: at >= 0 ? at : laneIndex };
  };

  const moveAcross = (id: string, fromLane: number, toLane: number, toIndex?: number) => {
    if (toLane < 0 || toLane >= lanes.length) return;
    dispatch({
      t: "laneMoveAcross",
      fundurId: fundur.event_id,
      band,
      fromLane,
      toLane,
      id,
      toIndex,
    });
  };

  return (
    <div className={styles.grid} style={{ ["--n" as string]: lanes.length }}>
      <div className={styles.head}>
        <div className={styles.axhd}>kl.</div>
        {lanes.map((lane, i) => {
          const { patrol, colourIndex } = flokkurOf(i);
          const used = laneMinutes(lane.items);
          const slack = duration - used;
          return (
            <div
              key={lane.patrol_id}
              className={styles.lanehd}
              style={{ ["--c" as string]: accentVarFor(patrol, colourIndex) }}
            >
              <span className={styles.fl}>{patrol?.name ?? lane.patrol_id}</span>
              <span className={styles.lt}>
                {used} mín{slack > 0 ? ` · ${slack} laus` : ""}
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.body} style={{ height: `${height}px` }}>
        <div className={styles.ax} aria-hidden="true">
          {ticks.map((m) => (
            <div key={m} className={styles.tick} style={{ top: `${m * PX_PER_MIN}px` }}>
              <span className={styles.tickT}>{clockAt(fundur, offset + m) ?? `+${m}`}</span>
            </div>
          ))}
        </div>

        {ticks.slice(1).map((m) => (
          <div
            key={`line-${m}`}
            className={styles.gline}
            style={{ top: `${m * PX_PER_MIN}px` }}
            aria-hidden="true"
          />
        ))}

        {lanes.map((lane, laneIndex) => {
          const { patrol, colourIndex } = flokkurOf(laneIndex);
          const used = laneMinutes(lane.items);
          let running = 0;

          return (
            <div
              key={lane.patrol_id}
              ref={(node) => {
                if (node) laneRefs.current.set(laneIndex, node);
                else laneRefs.current.delete(laneIndex);
              }}
              className={styles.glane}
              data-over={overLane === laneIndex && dragging?.laneIndex !== laneIndex}
              style={{ ["--c" as string]: accentVarFor(patrol, colourIndex) }}
              onDragOver={(e) => {
                if (!dragging) return;
                // Without preventDefault the browser refuses the drop outright.
                e.preventDefault();
                setOverLane(laneIndex);
              }}
              onDragLeave={() => setOverLane((current) => (current === laneIndex ? null : current))}
              onDrop={(e) => {
                e.preventDefault();
                setOverLane(null);
                if (!dragging) return;
                moveAcross(
                  dragging.id,
                  dragging.laneIndex,
                  laneIndex,
                  dropIndexFor(laneIndex, e.clientY)
                );
                setDragging(null);
              }}
            >
              {lane.items.map((item, i) => {
                const top = running * PX_PER_MIN;
                const at = clockAt(fundur, offset + running);
                running += item.minutes;
                const tight = item.minutes < TIGHT_MINUTES;

                return (
                  <div
                    key={item.id}
                    className={`${styles.gslot} ${tight ? styles.tight : ""}`}
                    style={{
                      top: `${top}px`,
                      height: `${Math.max(26, item.minutes * PX_PER_MIN - 3)}px`,
                    }}
                    data-on={selected === item.id || undefined}
                    data-dragging={dragging?.id === item.id || undefined}
                    draggable
                    onDragStart={(e) => {
                      // Firefox cancels a dragstart that sets no data at all,
                      // so the drop handlers never fire there without this.
                      e.dataTransfer.setData("text/plain", item.name);
                      e.dataTransfer.effectAllowed = "move";
                      setDragging({ laneIndex, id: item.id });
                    }}
                    onDragEnd={() => {
                      setDragging(null);
                      setOverLane(null);
                    }}
                  >
                    <button
                      type="button"
                      className={styles.gev}
                      aria-label={`${patrol?.name ?? ""}${at ? ` kl. ${at}` : ""}: ${item.name}, ${item.minutes} mín. Vinstri og hægri ör færa milli flokka.`}
                      aria-pressed={selected === item.id}
                      onClick={() =>
                        dispatch({ t: "laneSelect", id: selected === item.id ? null : item.id })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                          e.preventDefault();
                          moveAcross(
                            item.id,
                            laneIndex,
                            laneIndex + (e.key === "ArrowLeft" ? -1 : 1)
                          );
                          return;
                        }
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault();
                          dispatch({
                            t: "laneMove",
                            fundurId: fundur.event_id,
                            band,
                            laneIndex,
                            id: item.id,
                            to: i + (e.key === "ArrowUp" ? -1 : 1),
                          });
                          return;
                        }
                        if (e.key === "Delete" || e.key === "Backspace") {
                          e.preventDefault();
                          dispatch({
                            t: "laneRemove",
                            fundurId: fundur.event_id,
                            band,
                            laneIndex,
                            id: item.id,
                          });
                        }
                      }}
                    >
                      <span className={styles.gevHd}>
                        {at && <span className={styles.num}>{at}</span>}
                        <span className={styles.num}>{item.minutes} mín</span>
                      </span>
                      <span className={styles.gevT}>{item.name}</span>
                      {!tight && item.theme && <span className={styles.gevSub}>{item.theme}</span>}
                    </button>

                    {/*
                     * A sibling of the block, not a child of it. Buttons inside
                     * a button is invalid HTML, and the browser resolves it by
                     * giving the inner controls no keyboard activation at all —
                     * so ↑ and ✕ were mouse-only in a split band.
                     */}
                    {selected === item.id && (
                      <span className={styles.gevActs}>
                        <button
                          type="button"
                          className={styles.gib}
                          disabled={laneIndex === 0}
                          aria-label={`Færa ${item.name} til ${nameOfLane(laneIndex - 1)}`}
                          onClick={() => moveAcross(item.id, laneIndex, laneIndex - 1)}
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          className={styles.gib}
                          disabled={laneIndex === lanes.length - 1}
                          aria-label={`Færa ${item.name} til ${nameOfLane(laneIndex + 1)}`}
                          onClick={() => moveAcross(item.id, laneIndex, laneIndex + 1)}
                        >
                          →
                        </button>
                        <button
                          type="button"
                          className={styles.gib}
                          disabled={i === 0}
                          aria-label={`Færa ${item.name} upp`}
                          onClick={() =>
                            dispatch({
                              t: "laneMove",
                              fundurId: fundur.event_id,
                              band,
                              laneIndex,
                              id: item.id,
                              to: i - 1,
                            })
                          }
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className={styles.gib}
                          aria-label={`Fjarlægja ${item.name}`}
                          onClick={() =>
                            dispatch({
                              t: "laneRemove",
                              fundurId: fundur.event_id,
                              band,
                              laneIndex,
                              id: item.id,
                            })
                          }
                        >
                          ✕
                        </button>
                      </span>
                    )}
                  </div>
                );
              })}

              {/* The free tail: a short lane's idle time, offered as somewhere
                  to put something rather than left as a gap to interpret. */}
              {used < duration && (
                <button
                  type="button"
                  className={styles.ggap}
                  style={{
                    top: `${used * PX_PER_MIN}px`,
                    height: `${Math.max(20, (duration - used) * PX_PER_MIN - 3)}px`,
                  }}
                  aria-label={`Bæta verkefni við hjá ${patrol?.name ?? "flokknum"}${
                    clockAt(fundur, offset + used) ? ` kl. ${clockAt(fundur, offset + used)}` : ""
                  }`}
                  onClick={() =>
                    dispatch({
                      t: "laneAdd",
                      fundurId: fundur.event_id,
                      band,
                      laneIndex,
                      // Fits the slack the button just promised. The default of
                      // 15 made "+ 5 mín laus" insert a 15-minute block, which
                      // lengthened the band and re-clocked everything after it.
                      lidur: {
                        name: "Nýtt verkefni",
                        kind: BAND_KIND[band],
                        minutes: Math.max(MIN_MINUTES, Math.min(15, duration - used)),
                        status: "draft",
                        theme: fundur.theme ?? null,
                        venue: null,
                        endurmat: null,
                      },
                    })
                  }
                >
                  + {duration - used} mín laus
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.ft}>
        <span className={styles.eyebrow}>← → færa milli flokka · </span>
        <span className={styles.eyebrow}>
          Ristin er {duration} mín
          {clockAt(fundur, offset)
            ? ` — frá ${clockAt(fundur, offset)} til ${clockAt(fundur, offset + duration)}`
            : ""}
          . Lengsti flokkur ræður.
        </span>
      </div>
    </div>
  );
}
