"use client";

import React, { useMemo, useState } from "react";
import ProgramCard from "@/components/ProgramCard/ProgramCard";
import styles from "./builder.module.css";
import usePrograms, { Program as ProgramType } from "@/hooks/usePrograms";

export default function BuilderPage() {
    const [query, setQuery] = useState("");
    const [tagFilter, setTagFilter] = useState("all");

    // Use the hook that will fetch from the backend. The hook uses
    // `NEXT_PUBLIC_API_BASE` (fallbacks to http://localhost:8000) and expects
    // either an array response or `{ programs: Program[] }`.
    const { programs, tags, loading, error } = usePrograms();

    const filtered = useMemo(() => {
        if (!programs) return [] as ProgramType[];
        return (programs as ProgramType[]).filter((p: ProgramType) => {
            if (tagFilter !== "all" && !(p.tags || []).includes(tagFilter)) return false;
            if (!query) return true;
            const q = query.trim().toLowerCase();
            return p.title.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q);
        });
    }, [programs, query, tagFilter]);

    return (
        <section className="builder-page">
            <header>
                <h1>Vinnubekkurinn</h1>
                <p>Búðu til og skipuleggðu dagskrár.</p>
            </header>

            <div className={styles.container}>
                <aside className={styles.filters} aria-label="Síur">
                    <label>
                        Leit
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Leita í dagskrám" />
                    </label>

                    <label>
                        Tag
                        <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
                            <option value="all">Allt</option>
                            {/* Backend-driven tags (placeholder until API exists) */}
                            {loading ? (
                                <option disabled>Hleður…</option>
                            ) : (
                                (tags || []).map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))
                            )}
                        </select>
                    </label>

                    {error ? <div style={{ color: 'var(--sl-error, #b00020)' }}>Villa við að sækja gögn: {String(error.message || error)}</div> : null}
                </aside>

                <main className={styles.grid}>
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <ProgramCard key={`placeholder-${i}`} id={`ph-${i}`} title={`Hleður…`} description={undefined} tags={[]} />
                        ))
                    ) : filtered.length === 0 ? (
                        <div>Engar dagskrár fannst fyrir valin skilyrði.</div>
                    ) : (
                        filtered.map((p) => (
                            <ProgramCard key={p.id} id={p.id} title={p.title} description={p.description} tags={p.tags} />
                        ))
                    )}
                </main>
            </div>
        </section>
    );
}
