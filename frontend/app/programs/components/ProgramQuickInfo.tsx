import React from "react";
import styles from "./ProgramQuickInfo.module.css";

type Program = {
    id: string;
    name: string;
    created_at: string;
    like_count: number;
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

interface ProgramQuickInfoProps {
    program: Program;
}

export default function ProgramQuickInfo({ program }: ProgramQuickInfoProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("is-IS", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date);
    };

    return (
        <div className={styles.container}>
            {/* Quick Stats */}
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>📊 Stuttar upplýsingar</h3>
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statIcon}>⏱️</span>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Lengd</span>
                            <span className={styles.statValue}>60 mínútur</span>
                        </div>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statIcon}>👥</span>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Aldur</span>
                            <span className={styles.statValue}>9-12 ára</span>
                        </div>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statIcon}>📍</span>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Staðsetning</span>
                            <span className={styles.statValue}>Útisvæði</span>
                        </div>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statIcon}>👤</span>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Hópstærð</span>
                            <span className={styles.statValue}>10-20</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tags */}
            {program.tags && program.tags.length > 0 && (
                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>🏷️ Merki</h3>
                    <div className={styles.tags}>
                        {program.tags.map((tag, index) => (
                            <a
                                key={index}
                                href={`/programs?tags=${encodeURIComponent(tag)}`}
                                className={styles.tag}
                            >
                                {tag}
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* Workspace */}
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>🎯 Vinnusvæði</h3>
                <div className={styles.infoCard}>
                    {program.workspace ? (
                        <a
                            href={`/workspaces/${program.workspace.id}`}
                            className={styles.link}
                        >
                            {program.workspace.name}
                        </a>
                    ) : (
                        <span>Óþekkt vinnusvæði</span>
                    )}
                </div>
            </section>

            {/* Author */}
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>👤 Höfundur</h3>
                <div className={styles.infoCard}>
                    {program.author ? (
                        <a href={`/users/${program.author.id}`} className={styles.link}>
                            {program.author.name}
                        </a>
                    ) : (
                        <span>Óþekktur höfundur</span>
                    )}
                </div>
            </section>

            {/* Metadata */}
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>📅 Upplýsingar</h3>
                <div className={styles.metadata}>
                    <div className={styles.metaRow}>
                        <span className={styles.metaLabel}>Búið til</span>
                        <span className={styles.metaValue}>
                            {formatDate(program.created_at)}
                        </span>
                    </div>
                    <div className={styles.metaRow}>
                        <span className={styles.metaLabel}>Líkar</span>
                        <span className={styles.metaValue}>{program.like_count}</span>
                    </div>
                    <div className={styles.metaRow}>
                        <span className={styles.metaLabel}>Athugasemdir</span>
                        <span className={styles.metaValue}>
                            {program.comment_count || 0}
                        </span>
                    </div>
                </div>
            </section>

            {/* Actions */}
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>⚙️ Aðgerðir</h3>
                <div className={styles.actions}>
                    <button className={styles.actionButton}>
                        <span>🖨️</span> Prenta
                    </button>
                    <button className={styles.actionButton}>
                        <span>📄</span> Sækja PDF
                    </button>
                    <button className={styles.actionButton}>
                        <span>🚩</span> Tilkynna
                    </button>
                </div>
            </section>
        </div>
    );
}
