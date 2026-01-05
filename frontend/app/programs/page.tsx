"use client";

import React, { useMemo, useState, useEffect } from "react";
import Modal from "@/components/Modal/Modal";
import NewProgramForm from "@/components/NewProgram/NewProgramForm";
import ProgramCard from "@/components/ProgramCard/ProgramCard";
import ProgramSearch from "./components/ProgramSearch";
import ProgramGrid from "./components/ProgramGrid";
import ProgramFilters from "./components/ProgramFilters";
import ProgramSort, { type SortOption } from "./components/ProgramSort";
import Pagination from "./components/Pagination";
import styles from "./program.module.css";
import SAMPLE_DATA from "./devdata.json";

type Program = {
    id: string;
    content_type: "program";
    name: string;
    description: string | null;
    public: boolean;
    like_count: number;
    created_at: string;
    author_id: string;
    image: string | null;
    workspace_id: string;
    author: {
        id: string;
        name: string;
        email: string;
    };
    workspace: {
        id: string;
        name: string;
    };
    tags?: string[];
    comment_count?: number;
};

const SAMPLE: Program[] = SAMPLE_DATA as Program[];

export default function ProgramBuilderPage() {
    const [query, setQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [isSearching, setIsSearching] = useState(false);
    const [showNewProgram, setShowNewProgram] = useState(false);

    const ITEMS_PER_PAGE = 12; // Show 6 programs per page for demo

    const availableTags = useMemo(() => Array.from(new Set(SAMPLE.flatMap((s) => s.tags || []))), []);

    // Filter and sort items
    const filteredAndSortedItems = useMemo(() => {
        // Filter programs
        const filtered = SAMPLE.filter((p) => {
            // Tag filter: OR logic (show if ANY selected tag matches)
            if (selectedTags.length > 0) {
                const programTags = p.tags || [];
                const hasMatchingTag = selectedTags.some(selectedTag => programTags.includes(selectedTag));
                if (!hasMatchingTag) return false;
            }

            // Search filter
            if (query) {
                const q = query.trim().toLowerCase();
                const matchesSearch = p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q);
                if (!matchesSearch) return false;
            }

            return true;
        });

        // Sort programs
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
                case 'oldest':
                    return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
                case 'most-liked':
                    return (b.like_count || 0) - (a.like_count || 0);
                case 'alphabetical':
                    return a.name.localeCompare(b.name, 'is');
                default:
                    return 0;
            }
        });

        return sorted;
    }, [query, selectedTags, sortBy]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredAndSortedItems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const items = filteredAndSortedItems.slice(startIndex, endIndex);

    // Reset to page 1 when filters or sort changes
    useEffect(() => {
        setCurrentPage(1);
    }, [query, selectedTags, sortBy]);

    const handleSearch = () => {
        // Could trigger API call here when backend is ready
        setIsSearching(false);
    };

    const handleClearAllFilters = () => {
        setSelectedTags([]);
        setQuery("");
    };

    return (
        <section className="builder-page">
            <header>
                <div className={styles.headerRow}>
                    <div>
                        <h1>Dagskrárbankinn</h1>
                        <p>Leitaðu að og skoðaðu dagskrár hugmyndir.</p>
                    </div>
                    <div>
                        <button className={styles.addButton} onClick={() => setShowNewProgram(true)}>
                            Bæta hugmynd í bankann
                        </button>
                        <Modal open={showNewProgram} onClose={() => setShowNewProgram(false)} title="Bæta hugmynd í bankann">
                            <NewProgramForm onCreated={() => setShowNewProgram(false)} />
                        </Modal>
                    </div>
                </div>
            </header>

            <div className={styles.mainHeader}>
                <div className={styles.resultInfo}>
                    {filteredAndSortedItems.length === 1 ? (
                        <span>1 dagskrá</span>
                    ) : (
                        <span>{filteredAndSortedItems.length} dagskrár</span>
                    )}
                </div>
                <ProgramSort value={sortBy} onChange={setSortBy} />
            </div>

            <div className={styles.container}>
                <div className={styles.filtersWrapper}>
                    <div className={styles.filterSection}>
                        <label className={styles.filterLabel}>Leit</label>
                        <ProgramSearch
                            value={query}
                            onChange={setQuery}
                            onSearch={handleSearch}
                            resultCount={query.trim() || selectedTags.length > 0 ? filteredAndSortedItems.length : undefined}
                            placeholder="Leita að dagskrá"
                        />
                    </div>

                    <ProgramFilters
                        availableTags={availableTags}
                        selectedTags={selectedTags}
                        onTagsChange={setSelectedTags}
                        onClearAll={handleClearAllFilters}
                    />
                </div>

                <main className={styles.main}>
                    <ProgramGrid
                        isEmpty={filteredAndSortedItems.length === 0}
                        isLoading={isSearching}
                        emptyMessage={
                            query.trim() || selectedTags.length > 0
                                ? "Engar dagskrár fundust með þessari leit"
                                : "Engar dagskrár í boði"
                        }
                    >
                        {items.map((p) => (
                            <ProgramCard
                                key={p.id}
                                id={p.id}
                                name={p.name}
                                description={p.description}
                                tags={p.tags?.map(tag => ({ id: tag, name: tag }))}
                            />
                        ))}
                    </ProgramGrid>

                    {filteredAndSortedItems.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={filteredAndSortedItems.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                        />
                    )}
                </main>
            </div>
        </section>
    );
}


