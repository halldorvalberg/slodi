import React from "react";
import styles from "./ProgramDetailHero.module.css";

type Program = {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    author: {
        id: string;
        name: string;
        email: string;
    };
};

interface ProgramDetailHeroProps {
    program: Program;
    likeCount: number;
    isLiked: boolean;
    onLike: () => void;
    onShare: () => void;
    onAddToWorkspace: () => void;
}

export default function ProgramDetailHero({
    program,
    likeCount,
    isLiked,
    onLike,
    onShare,
    onAddToWorkspace,
}: ProgramDetailHeroProps) {
    return (
        <div className={styles.hero}>
            {/* Hero Image */}
            {program.image ? (
                <div className={styles.imageContainer}>
                    <img
                        src={program.image}
                        alt={program.name}
                        className={styles.heroImage}
                    />
                </div>
            ) : (
                <div className={styles.imagePlaceholder}>
                    <span className={styles.placeholderIcon}>📋</span>
                </div>
            )}

            {/* Title and Actions */}
            <div className={styles.headerRow}>
                <div className={styles.titleArea}>
                    <h1 className={styles.title}>{program.name}</h1>
                    <p className={styles.byline}>
                        eftir <a href={`/users/${program.author.id}`}>{program.author.name}</a>
                    </p>
                </div>

                <div className={styles.actions}>
                    <button
                        onClick={onLike}
                        className={`${styles.actionButton} ${isLiked ? styles.liked : ""}`}
                        aria-label={isLiked ? "Fjarlægja líkar" : "Líkar við"}
                    >
                        <span className={styles.icon}>
                            {isLiked ? "❤️" : "🤍"}
                        </span>
                        <span>{likeCount}</span>
                    </button>

                    <button
                        onClick={onShare}
                        className={styles.actionButton}
                        aria-label="Deila dagskrá"
                    >
                        <span className={styles.icon}>↗️</span>
                        <span>Deila</span>
                    </button>

                    <button
                        onClick={onAddToWorkspace}
                        className={styles.primaryButton}
                        aria-label="Bæta við vinnusvæði"
                    >
                        <span className={styles.icon}>+</span>
                        <span>Bæta við vinnusvæði</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
