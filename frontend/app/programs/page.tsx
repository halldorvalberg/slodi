"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal/Modal";
import NewProgramForm from "@/app/programs/components/NewProgramForm";
import ProgramCard from "@/components/ProgramCard/ProgramCard";
import ProgramGrid from "./components/ProgramGrid";
import Pagination from "./components/Pagination";
import { ProgramsHeader } from "./components/ProgramsHeader";
import { ProgramsToolbar } from "./components/ProgramsToolbar";
import styles from "./program.module.css";
import { useTags } from "@/hooks/useTags";
import usePrograms from "@/hooks/usePrograms";
import { useUserWorkspace } from "@/hooks/useUserWorkspace";
import { useProgramFilters } from "@/hooks/useProgramFilters";
import { usePagination } from "@/hooks/usePagination";
import { DEFAULT_WORKSPACE_ID, PROGRAMS_PER_PAGE } from "@/constants/config";

/**
 * Programs page - displays the program bank (dagskrárbankinn) with search,
 * filtering, sorting, and pagination capabilities.
 */
export default function ProgramsPage() {
    const [showNewProgram, setShowNewProgram] = useState(false);

    // Fetch data
    const { tagNames: availableTags, loading: tagsLoading } = useTags();
    const { programs, loading: programsLoading, error: programsError, refetch } = usePrograms(DEFAULT_WORKSPACE_ID);
    const { workspaceId: userWorkspaceId, error: workspaceError } = useUserWorkspace();

    // Apply filters and sorting
    const {
        query,
        setQuery,
        selectedTags,
        setSelectedTags,
        sortBy,
        setSortBy,
        filteredAndSorted,
        clearFilters,
    } = useProgramFilters(programs || []);

    // Apply pagination
    const {
        currentPage,
        totalPages,
        paginatedItems,
        setCurrentPage,
        totalItems,
        itemsPerPage,
    } = usePagination(filteredAndSorted, PROGRAMS_PER_PAGE);

    const handleProgramCreated = async () => {
        setShowNewProgram(false);
        await refetch();
    };

    // Show workspace error if it failed (non-blocking)
    if (workspaceError) {
        console.warn("Workspace error:", workspaceError);
    }

    return (
        <section className="builder-page">
            <ProgramsHeader onNewProgram={() => setShowNewProgram(true)} />

            <Modal
                open={showNewProgram}
                onClose={() => setShowNewProgram(false)}
                title="Bæta hugmynd í bankann"
            >
                <NewProgramForm
                    workspaceId={userWorkspaceId || DEFAULT_WORKSPACE_ID}
                    onCreated={handleProgramCreated}
                />
            </Modal>

            <ProgramsToolbar
                query={query}
                onQueryChange={setQuery}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                availableTags={availableTags || []}
                isLoadingTags={tagsLoading}
                sortBy={sortBy}
                onSortChange={setSortBy}
                resultCount={filteredAndSorted.length}
                onClearFilters={clearFilters}
            />

            <main className={styles.main}>
                <ProgramGrid
                    isEmpty={filteredAndSorted.length === 0}
                    isLoading={programsLoading}
                    emptyMessage={
                        programsError
                            ? "Villa kom upp við að sækja dagskrár"
                            : query.trim() || selectedTags.length > 0
                                ? "Engar dagskrár fundust með þessari leit"
                                : "Engar dagskrár í boði"
                    }
                >
                    {paginatedItems.map((p) => (
                        <ProgramCard
                            key={p.id}
                            id={p.id}
                            name={p.name}
                            description={p.description}
                            tags={p.tags}
                        />
                    ))}
                </ProgramGrid>

                {filteredAndSorted.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                    />
                )}
            </main>
        </section>
    );
}