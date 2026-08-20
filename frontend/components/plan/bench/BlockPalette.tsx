"use client";

import { useMemo, useState } from "react";
import { KIND_LABEL, type SlotKind } from "@/services/plan.service";
import { LIBRARY_FOLDERS, LIBRARY_KINDS } from "@/lib/mock/library.mock";
import { useBlockLibrary } from "@/hooks/usePlan";
import { useBench } from "./BenchProvider";
import styles from "./palette.module.css";

/**
 * The dagskrárbankinn rail — sc-145 `BlockPalette`, sc-146 `PaletteSearch`,
 * sc-147 `BlockLibraryItem`, sc-149 `PaletteEmptyState`.
 *
 * Every item carries its theme, its length and how often the sveit has run it.
 * That last one is the cheapest useful signal in the bank: a block used 31 times
 * is the sveit's own tradition, and one used once probably needs reading before
 * it gets dropped into a fundur.
 *
 * Adding is a *button*, not only a drag. The spec's governing principle is that
 * drag is an accelerator and never the only path (SPEC §0), and the sequencing
 * in §5 puts add-via-button before dnd-kit deliberately: steps 1–2 already give
 * a working, accessible assembler.
 */

export default function BlockPalette() {
  const bench = useBench();
  const { blocks } = useBlockLibrary();
  const activeFundur = bench?.state.active ?? null;

  const [folder, setFolder] = useState("allt");
  const [kind, setKind] = useState<SlotKind | "allt">("allt");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return blocks.filter((block) => {
      if (folder !== "allt" && block.folder !== folder) return false;
      if (kind !== "allt" && block.kind !== kind) return false;
      if (!needle) return true;
      return (
        block.name.toLowerCase().includes(needle) || block.theme.toLowerCase().includes(needle)
      );
    });
  }, [blocks, folder, kind, query]);

  return (
    <aside className={styles.src} aria-label="Dagskrá og möppur">
      <nav className={styles.nav} aria-label="Möppur">
        {LIBRARY_FOLDERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`${styles.fol} ${folder === f.id ? styles.folOn : ""}`}
            aria-pressed={folder === f.id}
            onClick={() => setFolder(f.id)}
          >
            <span className={styles.folL}>{f.label}</span>
            <span className={styles.folHint}>{f.hint}</span>
          </button>
        ))}
      </nav>

      <div className={styles.hd}>
        <label className={styles.srch}>
          <span className={styles.srOnly}>Leita í dagskrá</span>
          <input
            type="search"
            className={styles.in}
            placeholder="Leita…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className={styles.tabs} role="group" aria-label="Sía eftir tegund">
          {LIBRARY_KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              className={`${styles.tab} ${kind === k.id ? styles.tabOn : ""}`}
              aria-pressed={kind === k.id}
              onClick={() => setKind(k.id)}
            >
              {k.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        {blocks.length === 0 ? (
          // Not "no results" — there is no bank at all yet. Saying "ekkert
          // fannst" would blame the search for a missing backend.
          <p className={styles.emptyState}>
            Dagskrárbankinn er ekki tengdur enn. Þegar bakendinn svarar birtast blokkirnar hér.
          </p>
        ) : results.length === 0 ? (
          <p className={styles.emptyState}>
            Ekkert fannst{query ? ` fyrir „${query}“` : ""}. Prófaðu aðra möppu eða aðra tegund.
          </p>
        ) : (
          <ul className={styles.list}>
            {results.map((block) => (
              <li key={block.id} className={styles.item} data-kind={block.kind}>
                <span className={styles.itemKind} aria-hidden="true" />
                <span className={styles.itemBody}>
                  <span className={styles.itemT}>{block.name}</span>
                  <span className={styles.itemM}>
                    <span className={styles.num}>{block.minutes} mín</span>
                    <span className={styles.dot} aria-hidden="true" />
                    <span>{block.theme}</span>
                    <span className={styles.dot} aria-hidden="true" />
                    <span className={styles.srOnly}>{KIND_LABEL[block.kind]}, </span>
                    <span>notað {block.timesUsed}×</span>
                  </span>
                </span>
                <button
                  type="button"
                  className={styles.add}
                  disabled={!activeFundur}
                  title={activeFundur ? undefined : "Veldu fund á bekknum fyrst"}
                  onClick={() =>
                    activeFundur &&
                    bench?.dispatch({
                      t: "add",
                      fundurId: activeFundur,
                      lidur: {
                        name: block.name,
                        kind: block.kind,
                        minutes: block.minutes,
                        // A block arriving from the bank is a draft until the
                        // leader has looked at it — never silently confirmed.
                        status: "draft",
                        // B3: a reused block brings its context with it.
                        theme: block.theme,
                        venue: null,
                        endurmat: null,
                      },
                    })
                  }
                >
                  Bæta við
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.ft}>
        {/* Not wired to anything yet (sc-148). Disabled outright rather than
            enabled-but-inert: a button that swallows a click teaches people it
            is broken. `isMock` said the opposite — enabled only against
            fixtures, where it also did nothing. */}
        <button
          type="button"
          className={styles.create}
          disabled
          title="Kemur með Vinnubekknum — sc-148"
        >
          + Búa til nýja blokk…
        </button>
      </div>
    </aside>
  );
}
