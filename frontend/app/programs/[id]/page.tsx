"use client";

import React from "react";
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
    const { user, isAuthenticated, getToken } = useAuth();

    const [program, setProgram] = useState<Program | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

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

            {/* Hero Section */}
            <ProgramDetailHero
                program={program}
                likeCount={likeCount}
                isLiked={isLiked}
                onLike={handleLike}
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
