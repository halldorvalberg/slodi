"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchProgramById, type Program } from "@/services/programs.service";
import ProgramDetailHero from "../components/ProgramDetailHero";
import ProgramDetailTabs from "../components/ProgramDetailTabs";
import ProgramQuickInfo from "../components/ProgramQuickInfo";
import styles from "./program-detail.module.css";

interface ProgramDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ProgramDetailPage({ params }: ProgramDetailPageProps) {
    const router = useRouter();
    const { id } = React.use(params);

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

            {/* Main Content Grid */}
            <div className={styles.contentGrid}>
                {/* Tabs Section */}
                <div className={styles.mainContent}>
                    <ProgramDetailTabs program={program} />
                </div>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <ProgramQuickInfo program={program} />
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
