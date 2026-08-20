"use client";

import { Fragment } from "react";
import { BANDS, BAND_OF, type Fundur, type Patrol } from "@/services/plan.service";
import type { BenchIntent } from "./benchState";
import { count, takesSingular } from "../planEntries";
import { bandMinutes, clockAt, fundurMinutes, startTimes } from "./benchState";
import LidurEditor from "./LidurEditor";
import LidurRow from "./LidurRow";
import SplitGrid from "./SplitGrid";
import styles from "./bench.module.css";

/**
 * One fundur as a sheet — sc-163 `AssemblyHeader` plus the beinagrind bands.
 *
 * The three bands are not decoration. A fundur opens, does its work and closes,
 * and naming those sections in the layout is what lets a template be a *fixed
 * frame with fill-in blanks* (B4) rather than a copy of someone else's meeting.
 * A band with nothing in it still draws, because an empty Slit is a thing the
 * leader needs to see and fill, not an absence to hide.
 */

interface Props {
  fundur: Fundur;
  patrols: Patrol[];
  /** The rest of the bench, so a liður can be moved off this sheet. */
  otherFundir: Fundur[];
  isActive: boolean;
  isPast: boolean;
  selected: string | null;
  grabbed: string | null;
  editing: string | null;
  laneSelected: string | null;
  dispatch: (intent: BenchIntent) => void;
  registerRow: (id: string, node: HTMLDivElement | null) => void;
  focusSibling: (id: string, delta: -1 | 1) => void;
}

export default function FundurSheet({
  fundur,
  patrols,
  otherFundir,
  isActive,
  isPast,
  selected,
  grabbed,
  editing,
  laneSelected,
  dispatch,
  registerRow,
  focusSibling,
}: Props) {
  const starts = startTimes(fundur);
  // Split bands count once, not once per lane — the flokkar run concurrently.
  const total = fundurMinutes(fundur);
  const over = total > fundur.planned_minutes;

  /**
   * Every liður on the sheet, lanes included.
   *
   * `splitBand` moves a band's liðir out of `items` and into lanes, so counting
   * `items` alone made the header drop from "4 liðir" to "2 liðir" the moment a
   * band was split, and the footer flip to "Allir liðir ákveðnir" while four
   * lanes each still held an undecided copy. The minutes beside it were already
   * lane-aware, so the two numbers disagreed in the same line of the header.
   */
  const allItems = [
    ...fundur.items,
    ...Object.values(fundur.split ?? {}).flatMap((lanes) =>
      (lanes ?? []).flatMap((lane) => lane.items)
    ),
  ];

  const clock = fundur.starts_at ? /T(\d{2}):(\d{2})/.exec(fundur.starts_at) : null;
  const endsAt = clockAt(fundur, total);
  const undecided = allItems.filter((item) => item.status === "unknown").length;

  return (
    <section
      className={styles.sheet}
      data-active={isActive}
      data-past={isPast}
      aria-label={`${fundur.title} · ${fundur.date_label}`}
      onFocus={() => dispatch({ t: "activate", fundurId: fundur.event_id })}
    >
      <header className={styles.sheetHd}>
        <div className={styles.sheetId}>
          <div className={styles.sheetKick}>
            {fundur.theme && (
              <span className={styles.cyc}>
                {fundur.theme}
                {fundur.of_weeks ? ` · vika ${fundur.week_index}/${fundur.of_weeks}` : ""}
              </span>
            )}
            {fundur.venue && <span className={styles.eyebrow}>{fundur.venue}</span>}
            {fundur.scope === "troop-wide" && <span className={styles.troopWide}>Öll sveitin</span>}
          </div>
          <h3 className={styles.sheetT}>
            {fundur.title} · {fundur.date_label}
          </h3>
          <div className={styles.sheetWhen}>
            <b className={styles.num}>{clock ? `${clock[1]}:${clock[2]}–${endsAt}` : "Ódagsett"}</b>
            <span className={styles.num}>
              áætlað {fundur.planned_minutes} mín · {count(allItems.length, "liður", "liðir")}
            </span>
          </div>
        </div>
      </header>

      {BANDS.map((band) => {
        const lanes = fundur.split?.[band.id];
        const items = fundur.items.filter((item) => BAND_OF[item.kind] === band.id);
        const minutes = bandMinutes(fundur, band.id);

        return (
          <div key={band.id}>
            <div className={styles.band}>
              <span className={styles.bandL}>{band.label}</span>
              <span className={styles.bandHint}>{band.hint}</span>

              {/*
               * Splitting only makes sense for a fundur the whole sveit is at:
               * a flokksfundur has one flokkur in the room, so dealing it into
               * lanes would produce columns nobody is standing in.
               */}
              {fundur.scope === "troop-wide" && (
                <button
                  type="button"
                  className={styles.bandsplit}
                  aria-pressed={Boolean(lanes)}
                  title={
                    lanes
                      ? "Hver flokkur hefur sinn eigin tíma. Smelltu til að sameina í eina röð."
                      : "Hver flokkur fær sinn eigin tíma í rist, með tímaás og einni súlu á flokk."
                  }
                  onClick={() =>
                    dispatch({
                      t: lanes ? "mergeBand" : "splitBand",
                      fundurId: fundur.event_id,
                      band: band.id,
                    })
                  }
                >
                  {lanes ? "Sameina í eitt" : "Skipta á flokka"}
                </button>
              )}

              <span className={`${styles.bandN} ${styles.num}`}>
                {minutes ? `${minutes} mín${lanes ? " samhliða" : ""}` : "—"}
              </span>
            </div>

            {lanes ? (
              <SplitGrid
                fundur={fundur}
                band={band.id}
                patrols={patrols}
                selected={laneSelected}
                dispatch={dispatch}
              />
            ) : items.length === 0 ? (
              // sc-141 BlankSlot: the unfilled frame, stated rather than hidden.
              // The band's own name is not interpolated into the sentence — it
              // would need the dative ("í setningu", not "í setning"), and the
              // heading directly above already says which band this is.
              <p className={styles.blank}>Ekkert skráð hér enn.</p>
            ) : (
              <div role="list" className={styles.rows}>
                {items.map((lidur, positionInBand) => {
                  const index = fundur.items.findIndex((item) => item.id === lidur.id);
                  return (
                    // A Fragment, not a div: an element between the list and
                    // its listitems breaks the ownership screen readers use to
                    // say "3 af 5".
                    <Fragment key={lidur.id}>
                      <LidurRow
                        fundur={fundur}
                        lidur={lidur}
                        index={index}
                        canMoveUp={positionInBand > 0}
                        canMoveDown={positionInBand < items.length - 1}
                        isEditing={editing === lidur.id}
                        startsAt={starts[index]}
                        isSelected={selected === lidur.id}
                        isGrabbed={grabbed === lidur.id}
                        dispatch={dispatch}
                        registerRow={registerRow}
                        focusSibling={focusSibling}
                      />
                      {editing === lidur.id && (
                        <LidurEditor
                          fundur={fundur}
                          otherFundir={otherFundir}
                          lidur={lidur}
                          position={index + 1}
                          total={fundur.items.length}
                          startsAt={starts[index]}
                          dispatch={dispatch}
                          onClose={() => dispatch({ t: "edit", id: null })}
                        />
                      )}
                    </Fragment>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <footer className={styles.sheetFt}>
        <span className={styles.eyebrow}>
          {/* The adjective agrees too — "1 liður enn óákveðinn", not "óákveðnir". */}
          {undecided > 0
            ? `${count(undecided, "liður", "liðir")} enn ${
                takesSingular(undecided) ? "óákveðinn" : "óákveðnir"
              }`
            : "Allir liðir ákveðnir"}
        </span>
        <span className={`${styles.tot} ${over ? styles.over : ""}`}>
          {total} / {fundur.planned_minutes} mín
          {over ? ` · ${total - fundur.planned_minutes} yfir` : ""}
        </span>
      </footer>
    </section>
  );
}
