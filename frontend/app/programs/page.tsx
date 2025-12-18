"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import NewProgramForm from "@/components/NewProgram/NewProgramForm";
import ProgramCard from "@/components/ProgramCard/ProgramCard";
import styles from "./program.module.css";

type Program = {
    id: string;
    title: string;
    description?: string;
    tags?: string[];
};

const SAMPLE: Program[] = [
    { id: "p1", title: "Dagskrá A", description: "Stutt lýsing á dagskrá A.", tags: ["barn", "leikur"] },
    { id: "p2", title: "Dagskrá B", description: "Skemmtileg dagskrá fyrir yngri hópa.", tags: ["útilegur"] },
    { id: "p3", title: "Dagskrá C", description: "Kennsludagskrá.", tags: ["kennslu"] },
];

export default function BuilderPage() {
    const [query, setQuery] = useState("");
    const [tagFilter, setTagFilter] = useState("all");
    const router = useRouter();
    const [showNewProgram, setShowNewProgram] = useState(false);

    const tags = useMemo(() => Array.from(new Set(SAMPLE.flatMap((s) => s.tags || []))), []);

    const items = useMemo(() => {
        return SAMPLE.filter((p) => {
            if (tagFilter !== "all" && !(p.tags || []).includes(tagFilter)) return false;
            if (!query) return true;
            const q = query.trim().toLowerCase();
            return p.title.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q);
        });
    }, [query, tagFilter]);

    return (
        <section className="builder-page">
            <header>
                <div className={styles.headerRow}>
                    <div>
                        <h1>Dagskrárbankinn</h1>
                        <p>Leitaðu að og skoðaðu dagskrár hugmyndir.</p>
                    </div>
                                        <div>
                                                <button className={styles.addButton} onClick={() => setShowNewProgram(true)}>Bæta hugmynd í bankann</button>
                                                <Modal open={showNewProgram} onClose={() => setShowNewProgram(false)} title="Bæta hugmynd í bankann">
                                                    <NewProgramForm onCreated={() => setShowNewProgram(false)} />
                                                </Modal>
                                        </div>
                </div>
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
                            {tags.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </label>
                </aside>

                <main className={styles.grid}>
                    {items.map((p) => (
                        <ProgramCard key={p.id} id={p.id} title={p.title} description={p.description} tags={p.tags} />
                    ))}
                </main>
            </div>
        </section>
    );
}

