"use client";

import React, { useMemo, useState, useEffect } from "react";
import Modal from "@/components/Modal/Modal";
import NewProgramForm from "@/app/programs/components/NewProgramForm";
import ProgramCard from "@/components/ProgramCard/ProgramCard";
import ProgramSearch from "./components/ProgramSearch";
import ProgramGrid from "./components/ProgramGrid";
import ProgramFilters from "./components/ProgramFilters";
import ProgramSort, { type SortOption } from "./components/ProgramSort";
import Pagination from "./components/Pagination";
import styles from "./program.module.css";
import {
    filterProgramsByQuery,
    filterProgramsByTags,
    sortPrograms
} from "@/services/programs.service";
import { useTags } from "@/hooks/useTags";
import usePrograms from "@/hooks/usePrograms";
import { useAuth } from "@/hooks/useAuth";
import { getOrCreatePersonalWorkspace } from "@/services/workspaces.service";

export default function ProgramBuilderPage() {
    const { user, getToken, isAuthenticated } = useAuth();
    const [query, setQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [showNewProgram, setShowNewProgram] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [userWorkspaceId, setUserWorkspaceId] = useState<string | null>(null);

    const ITEMS_PER_PAGE = 12; // Show 12 programs per page

    // Default public workspace ID for viewing programs (dagskrábankinn)
    const defaultWorkspaceId = process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE_ID || "";

    // Fetch tags from backend using tags.service.ts
    const { tagNames: backendTags, loading: tagsLoading } = useTags();

    // Fetch programs from backend (from the default public workspace)
    const { programs: backendPrograms, loading: programsLoading, error: programsError, refetch } = usePrograms(defaultWorkspaceId);

    // Get or create user's personal workspace on mount
    useEffect(() => {
        async function fetchUserWorkspace() {
            if (!isAuthenticated || !user) return;

            try {
                const token = await getToken();
                if (!token) return;

                const workspace = await getOrCreatePersonalWorkspace(user.id, token);
                setUserWorkspaceId(workspace.id);
            } catch (error) {
                console.error("Failed to get user workspace:", error);
            }
        }

        fetchUserWorkspace();
    }, [isAuthenticated, user, getToken]);

    const availableTags = backendTags || [];
    const programs = useMemo(() => backendPrograms || [], [backendPrograms]);

    // Filter and sort items
    const filteredAndSortedItems = useMemo(() => {
        // Apply tag filter
        let filtered = filterProgramsByTags(programs, selectedTags);

        // Apply search filter
        filtered = filterProgramsByQuery(filtered, query);

        // Apply sort
        return sortPrograms(filtered, sortBy);
    }, [programs, query, selectedTags, sortBy]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredAndSortedItems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const items = filteredAndSortedItems.slice(startIndex, endIndex);

    // Reset to page 1 when filters or sort changes
    useEffect(() => {
        setCurrentPage(1);
    }, [query, selectedTags, sortBy]);

    // Scroll to top of page when page changes
    useEffect(() => {
        const headerElement = document.querySelector('header');
        if (headerElement) {
            headerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage]);

    const handleSearch = () => {
        // Search is handled by client-side filtering
        setIsSearching(false);
    };

    const handleClearAllFilters = () => {
        setSelectedTags([]);
        setQuery("");
    };

    const handleProgramCreated = async () => {
        setShowNewProgram(false);
        await refetch(); // Refresh program list to show new program
    };

    return (
        <section className="builder-page">
            <header>
                <div className={styles.headerRow}>
                    <div>
                        <h1>Dagskrárbankinn</h1>
                        <p>Leitaðu að og skoðaðu dagskrár hugmyndir.</p>
                    </div>
                </div>
            </header>

            {/* Floating Action Button */}
            <button
                className={styles.fab}
                onClick={() => setShowNewProgram(true)}
                aria-label="Bæta við dagskrá"
            >
                <svg className={styles.fabIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className={styles.fabLabel}>Bæta við dagskrá</span>
            </button>

            <Modal open={showNewProgram} onClose={() => setShowNewProgram(false)} title="Bæta hugmynd í bankann">
                <NewProgramForm
                    workspaceId={userWorkspaceId || defaultWorkspaceId}
                    onCreated={handleProgramCreated}
                />
            </Modal>

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
                        {/* <label className={styles.filterLabel}>Leit</label> */}
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
                        isLoadingTags={tagsLoading}
                    />
                </div>

                <main className={styles.main}>
                    <ProgramGrid
                        isEmpty={filteredAndSortedItems.length === 0}
                        isLoading={programsLoading}
                        emptyMessage={
                            programsError
                                ? "Villa kom upp við að sækja dagskrár"
                                : query.trim() || selectedTags.length > 0
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


