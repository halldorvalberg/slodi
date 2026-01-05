"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./NewProgramForm.module.css";
import type { Program as ProgramType } from "@/hooks/usePrograms";
import usePrograms from "@/hooks/usePrograms";

type Props = {
  onCreated?: (program: ProgramType) => void;
  endpoint?: string; // relative endpoint, defaults to '/programs'
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function NewProgramForm({ onCreated, endpoint = "/programs" }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // selected tags for this new program
  const [tags, setTags] = useState<string[]>([]);
  // selected age groups
  const [ages, setAges] = useState<string[]>([]);
  // duration (e.g., "30 mínútur"), equipment and images
  const [duration, setDuration] = useState<string>("");
  const [equipment, setEquipment] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const previewsRef = React.useRef<string[]>([]);

  React.useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  React.useEffect(() => {
    return () => {
      // revoke any remaining object URLs on unmount
      previewsRef.current.forEach((u) => {
        try { URL.revokeObjectURL(u); } catch { /* ignore */ }
      });
    };
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // get available tags from the same source used in the search/listing
  const { tags: availableTags, loading: tagsLoading } = usePrograms();
  // Placeholder tags for testing when backend provides none
  const PLACEHOLDER_TAGS = ["barn", "leikur", "útilegur", "kennslu", "fjölskyldu"];

  // fixed age groups (labels in Icelandic). Each has a color for stroke/fill.
  const AGE_GROUPS: { id: string; label: string; color: string }[] = [
    { id: "drekaskatar", label: "Drekaskátar", color: "#f97316" },
    { id: "falkaskatar", label: "Fálkaskátar", color: "#fb7185" },
    { id: "drottskatar", label: "Dróttskátar", color: "#60a5fa" },
    { id: "rekkaskatar", label: "Rekkaskátar", color: "#a78bfa" },
    { id: "roverskatar", label: "Róverskátar", color: "#34d399" },
  ];

  const create = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Titill má ekki vera auður");
      return;
    }
    try {
      const form = new FormData();
      form.append("title", title.trim());
      if (description.trim()) form.append("description", description.trim());
      if (duration.trim()) form.append("duration", duration.trim());
      if (equipment.trim()) form.append("equipment", equipment.trim());
      // arrays as JSON strings
      form.append("tags", JSON.stringify(tags));
      form.append("ages", JSON.stringify(ages));
      images.forEach((f, i) => form.append("images", f, f.name || `image-${i}`));

      const url = new URL(endpoint, API_BASE).toString();
      const res = await fetch(url, {
        method: "POST",
        body: form,
        credentials: "include",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server error: ${res.status} ${res.statusText} ${txt}`);
      }

      const data = await res.json();
      const program: ProgramType = Array.isArray(data) ? data[0] : data.program || data;
      onCreated?.(program as ProgramType);

      // reset form
      setTitle("");
      setDescription("");
      setTags([]);
      setAges([]);
      setDuration("");
      setEquipment("");
      // revoke previews before clearing
      previews.forEach((u) => { try { URL.revokeObjectURL(u); } catch { /* ignore */ } });
      setImages([]);
      setPreviews([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={create} aria-label="Ný dagskrá">
      <label>
        Heiti Hugmyndar
        <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Heiti hugmyndar" />
      </label>

      <label>
        Lýsing verkefnis
        <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Stutt lýsing á verkefninu" />
      </label>

      <div className={styles.rowField}>
        <label style={{ flex: 1 }}>
          Tímalengd
          <input className={`${styles.input} ${styles.smallInput}`} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="t.d. 30 mín" />
        </label>

        <label style={{ flex: 2 }}>
          Búnaður
          <input className={styles.input} value={equipment} onChange={(e) => setEquipment(e.target.value)} placeholder="T.d. bolt, kaffi" />
        </label>
      </div>

      <label>
        Aldursbil
        <div className={styles.ageGrid}>
          {AGE_GROUPS.map((g) => {
            const selected = ages.includes(g.id);
            const style: React.CSSProperties = selected
              ? { background: g.color, borderColor: g.color }
              : { background: "transparent", borderColor: g.color, color: undefined };
            return (
              <button
                key={g.id}
                type="button"
                className={`${styles.ageChip} ${selected ? styles.selected : ""}`}
                style={style}
                aria-pressed={selected}
                onClick={() => setAges((s) => (s.includes(g.id) ? s.filter((x) => x !== g.id) : [...s, g.id]))}
              >
                {g.label}
              </button>
            );
          })}
        </div>
        <div className={styles.hint}>Veldu eitt eða fleiri aldursbil sem verkefnið hentar fyrir.</div>
      </label>

      <label>
        Merkimiðar
        <div className={styles.tagList} aria-live="polite">
          {tags.length === 0 ? <div className={styles.hint}>Engir merkimiðar valdir enn</div> : null}
          {((availableTags && availableTags.length > 0) ? availableTags : (!tagsLoading ? PLACEHOLDER_TAGS : [])).map((t) => {
            const selected = tags.includes(t);
            return selected ? (
              <span key={t} className={`${styles.tagChip} selected`}>
                {t}
                <button type="button" className={styles.tagButton} aria-label={`Fjarlægja merkimiða ${t}`} onClick={() => setTags((s) => s.filter((x) => x !== t))}>✕</button>
              </span>
            ) : (
              <span key={t} className={styles.tagItem}>
                {t}
                <button type="button" className={styles.tagButton} aria-label={`Bæta merkimiða ${t}`} onClick={() => setTags((s) => Array.from(new Set([...s, t])))}>+</button>
              </span>
            );
          })}
          {tagsLoading ? <div className={styles.hint}>Hleður merkimiða…</div> : null}
          {!tagsLoading && (!availableTags || availableTags.length === 0) ? (
            <div className={styles.hint}>Engir merkimiðar frá bakenda — sýni staðgengla til prófunar.</div>
          ) : null}
        </div>
      </label>

      <label>
        Myndir
        <div className={styles.fileInput}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length === 0) return;
              setImages((s) => [...s, ...files]);
              // create previews
              const urls = files.map((f) => URL.createObjectURL(f));
              setPreviews((p) => [...p, ...urls]);
              // note: should revokeObjectURL on cleanup/remove
            }}
          />

          <div className={styles.imageGrid}>
            {previews.map((src, i) => (
              <div key={src} className={styles.imageThumb}>
                <Image src={src} alt={`Preview ${i + 1}`} width={200} height={200} />
                <button type="button" className={styles.imageRemove} aria-label="Fjarlægja mynd" onClick={() => {
                  // revoke object URL and remove image/preview
                  try { URL.revokeObjectURL(src); } catch { /* ignore */ }
                  setPreviews((p) => p.filter((x, idx) => idx !== i));
                  setImages((arr) => arr.filter((__, idx) => idx !== i));
                }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      </label>

      {error ? <div className={styles.error}>{error}</div> : null}

      <div className={styles.actions}>
        <button type="button" className={`${styles.btn} ${styles.btnNeutral}`} onClick={() => { setTitle(""); setDescription(""); setTags([]); }} disabled={loading}>Hreinsa</button>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>{loading ? "Býr til…" : "Búa til"}</button>
      </div>
    </form>
  );
}
