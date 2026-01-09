"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchProgramById, updateProgram, type Program } from "@/services/programs.service";
import { useAuth } from "@/contexts/AuthContext";
import { canEditProgram } from "@/lib/permissions";
import type { ProgramUpdateFormData } from "@/lib/validation";
import ProgramDetailHero from "../components/ProgramDetailHero";
import ProgramDetailTabs from "../components/ProgramDetailTabs";
import ProgramQuickInfo from "../components/ProgramQuickInfo";
import ProgramDetailEdit from "./components/ProgramDetailEdit";
import styles from "./program-detail.module.css";

interface ProgramDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ProgramDetailPage({ params }: ProgramDetailPageProps) {
    const router = useRouter();
    const { id } = React.use(params);
    const { user, isAuthenticated, getToken } = useAuth();

    const [program, setProgram] = useState<Program | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        async function fetchProgram() {
            try {
                setIsLoading(true);
                const data = await fetchProgramById(id);
                setProgram(data);
                setLikeCount(data.like_count || 0);
            } catch (error) {
                console.error("Failed to fetch program:", error);
                setProgram(null);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProgram();
    }, [id]);

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div style={{ padding: "2rem", textAlign: "center" }}>
                    Hleð dagskrá...
                </div>
            </div>
        );
    }

    if (!program) {
        notFound();
    }

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        // TODO: API call to backend
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: program.name,
                text: program.description || "",
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Hlekkur afritaður!");
        }
    };

    const handleAddToWorkspace = () => {
        // TODO: Implement add to workspace
        alert("Bæta við vinnusvæði - kemur síðar");
    };

    const handleBack = () => {
        router.push("/programs");
    };

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
    };

    const handleSaveEdit = async (data: ProgramUpdateFormData) => {
        if (!program) return;

        try {
            const token = await getToken();
            if (!token) {
                throw new Error("Ekki tókst að sækja auðkenni");
            }

            // Transform data: convert null to undefined for API compatibility
            const updateData: {
                name: string;
                description?: string;
                public: boolean;
            } = {
                name: data.name,
                public: data.public,
            };

            // Only include description if it's not null
            if (data.description !== null && data.description !== undefined) {
                updateData.description = data.description;
            }

            // Update program via API
            const updatedProgram = await updateProgram(program.id, updateData, getToken);

            // Update local state
            setProgram(updatedProgram);
            setIsEditMode(false);

            // Optional: Show success message
            // You could add a toast notification here
        } catch (error) {
            console.error("Failed to update program:", error);
            throw error; // Re-throw to let the form component handle the error
        }
    };

    // Check if current user can edit this program
    const canEdit = program ? canEditProgram(user, program) : false;

    return (
        <div className={styles.container}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <ol>
                    <li>
                        <Link href="/">Heim</Link>
                    </li>
                    <li>
                        <Link href="/programs">Dagskrár</Link>
                    </li>
                    <li aria-current="page">{program.name}</li>
                </ol>
            </nav>

            {/* Edit Mode */}
            {isEditMode && program && (
                <ProgramDetailEdit
                    program={program}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                />
            )}

            {/* Hero Section - Hidden during edit mode */}
            {!isEditMode && (
                <ProgramDetailHero
                    program={program}
                    likeCount={likeCount}
                    isLiked={isLiked}
                    isAuthenticated={isAuthenticated}
                    canEdit={canEdit}
                    isEditMode={isEditMode}
                    onLike={handleLike}
                    onShare={handleShare}
                    onAddToWorkspace={handleAddToWorkspace}
                    onEdit={handleEdit}
                />
            )}

            {/* Main Content Grid */}
            <div className={styles.contentGrid}>
                {/* Tabs Section */}
                <div className={styles.mainContent}>
                    <ProgramDetailTabs program={program} />
                </div>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <ProgramQuickInfo
                        program={{
                            ...program,
                            tags: program.tags?.map(tag => ({ id: tag.id, name: tag.name })),
                        }}
                    />
                </aside>
            </div>

            {/* Back Button */}
            <div className={styles.backButton}>
                <button onClick={handleBack} className={styles.backBtn}>
                    ← Til baka í dagskrárlista
                </button>
            </div>
        </div>
    );
}
