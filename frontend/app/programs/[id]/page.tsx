"use client";

import React from "react";
import { notFound } from "next/navigation";
import ProgramDetailHero from "../components/ProgramDetailHero";
import ProgramDetailTabs from "../components/ProgramDetailTabs";
import ProgramQuickInfo from "../components/ProgramQuickInfo";
import styles from "./program-detail.module.css";
import { useProgram } from "@/hooks/useProgram";
import { useProgramLikes } from "@/hooks/useProgramLikes";
import { Breadcrumb } from "@/app/programs/components/Breadcrumb";
import { ROUTES } from "@/constants/routes";
import { useProgramActions } from "@/hooks/useProgramActions";
import { ProgramDetailError } from "@/app/programs/components/ProgramDetailError";
import { ProgramDetailSkeleton } from "@/app/programs/components/ProgramDetailSkeleton";

interface ProgramDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

/**
 * Program detail page component that displays comprehensive information about a single program.
 * 
 * @param params - URL parameters containing the program ID
 * @returns Program detail view with hero section, tabs, and sidebar information
 */
export default function ProgramDetailPage({ params }: ProgramDetailPageProps) {
    const { id } = React.use(params);

    const { program, isLoading, error } = useProgram(id);
    const { likeCount, isLiked, toggleLike } = useProgramLikes(program?.like_count || 0);
    const { handleShare, handleAddToWorkspace, handleBack } = useProgramActions(program);

    // All hooks are called first, then we do conditional rendering
    if (error) return <ProgramDetailError error={error} />;
    if (isLoading) return <ProgramDetailSkeleton />;
    if (!program) notFound();

    const breadcrumbItems = [
        { label: 'Heim', href: ROUTES.HOME },
        { label: 'Dagskrár', href: ROUTES.PROGRAMS },
        { label: program.name }
    ];

    return (
        <div className={styles.container}>
            <Breadcrumb items={breadcrumbItems} />

            <ProgramDetailHero
                program={program}
                likeCount={likeCount}
                isLiked={isLiked}
                onLike={toggleLike}  // Changed from handleLike
                onShare={handleShare}
                onAddToWorkspace={handleAddToWorkspace}
            />

            <div className={styles.contentGrid}>
                <div className={styles.mainContent}>
                    <ProgramDetailTabs program={program} />
                </div>
                <aside className={styles.sidebar}>
                    <ProgramQuickInfo program={program} />
                </aside>
            </div>

            <div className={styles.backButton}>
                <button onClick={handleBack} className={styles.backBtn}>
                    ← Til baka í dagskrárlista
                </button>
            </div>
        </div>
    );
}
