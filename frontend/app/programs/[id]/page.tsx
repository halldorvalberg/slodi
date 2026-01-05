"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import SAMPLE_DATA from "../devdata.json";
import ProgramDetailHero from "../components/ProgramDetailHero";
import ProgramDetailTabs from "../components/ProgramDetailTabs";
import ProgramQuickInfo from "../components/ProgramQuickInfo";
import styles from "./program-detail.module.css";

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

interface ProgramDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ProgramDetailPage({ params }: ProgramDetailPageProps) {
    const router = useRouter();
    const { id } = React.use(params);
    const program = SAMPLE.find((p) => p.id === id);

    const [likeCount, setLikeCount] = useState(program?.like_count || 0);
    const [isLiked, setIsLiked] = useState(false);

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
                        <a href="/">Heim</a>
                    </li>
                    <li>
                        <a href="/programs">Dagskrár</a>
                    </li>
                    <li>
                        <a href={`/programs?workspace=${program.workspace_id}`}>
                            {program.workspace.name}
                        </a>
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
