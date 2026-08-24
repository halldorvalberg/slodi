"use client";

import { useState } from "react";
import { CONTENT_TYPES, CONTENT_TYPE_LABEL, type ContentType } from "@/services/content.service";
import styles from "./ProgramsHeader.module.css";

interface ProgramsHeaderProps {
  /** Called with the type the user picked. */
  onNewContent: (type: ContentType) => void;
}

/**
 * What each type is for, in one line.
 *
 * The distinction is the whole point of the reclassify and it is not obvious
 * from the names alone: a leikur is a Verkefni, not a Dagskrá. Saying so at the
 * moment of choosing is the cheapest place to teach it.
 */
const TYPE_HINT: Record<ContentType, string> = {
  task: "Einn dagskrárliður — leikur, setning, eitt verkefni",
  event: "Eitthvað sem gerist á tilteknum tíma — útilega, mót, dagsferð",
  program: "Safn af liðum og viðburðum — dagskrárhringur",
};

export function ProgramsHeader({ onNewContent }: ProgramsHeaderProps) {
  const [open, setOpen] = useState(false);

  const choose = (type: ContentType) => {
    setOpen(false);
    onNewContent(type);
  };

  return (
    <>
      {/* Clicking away closes the menu. Rendered before it so it sits beneath. */}
      {open && <div className={styles.scrim} onClick={() => setOpen(false)} aria-hidden="true" />}

      {open && (
        <div className={styles.typeMenu} role="menu" aria-label="Hvað viltu búa til?">
          {CONTENT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              role="menuitem"
              className={styles.typeOption}
              onClick={() => choose(type)}
            >
              <span className={styles.typeName}>{CONTENT_TYPE_LABEL[type]}</span>
              <span className={styles.typeHint}>{TYPE_HINT[type]}</span>
            </button>
          ))}
        </div>
      )}

      <button
        className={styles.fab}
        onClick={() => setOpen((v) => !v)}
        aria-label="Bæta við í bankann"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <svg className={styles.fabIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className={styles.fabLabel}>Bæta við í bankann</span>
      </button>
    </>
  );
}
