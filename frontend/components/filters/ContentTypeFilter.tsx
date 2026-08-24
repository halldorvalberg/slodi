"use client";

import CollapsibleSection from "@/components/ui/CollapsibleSection";
import { CONTENT_TYPES, CONTENT_TYPE_LABEL, type ContentType } from "@/services/content.service";
import styles from "./filters.module.css";

interface ContentTypeFilterProps {
  selected: ContentType[];
  onChange: (selected: ContentType[]) => void;
  defaultOpen?: boolean;
}

/**
 * Which kinds of thing to show — Verkefni, Viðburður, Dagskrá.
 *
 * The bank holds all three since the reclassify: a single activity is a Task
 * (the smallest unit), and a Program is a *collection* of Events and Tasks. OR
 * logic, like every other multi-select here, and nothing selected means all of
 * them rather than none.
 *
 * First in the sidebar because it is the coarsest cut available — it is the one
 * filter that can halve the list in a single click.
 */
export default function ContentTypeFilter({
  selected,
  onChange,
  defaultOpen = false,
}: ContentTypeFilterProps) {
  const handleToggle = (type: ContentType) => {
    if (selected.includes(type)) {
      onChange(selected.filter((t) => t !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <CollapsibleSection label="Tegund" activeCount={selected.length} defaultOpen={defaultOpen}>
      <div className={styles.checkboxGroup} role="group" aria-label="Tegund efnis">
        {CONTENT_TYPES.map((type) => {
          const isSelected = selected.includes(type);
          return (
            <label
              key={type}
              className={`${styles.checkboxLabel} ${isSelected ? styles.checkboxLabelSelected : ""}`}
            >
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isSelected}
                onChange={() => handleToggle(type)}
              />
              {CONTENT_TYPE_LABEL[type]}
            </label>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}
