"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useFavorites } from "@/contexts/FavoritesContext";
import ProgramCard from "@/components/ProgramCard/ProgramCard";
import ProgramGrid from "../components/ProgramGrid";
import ProgramSort, { type SortOption } from "../components/ProgramSort";
import styles from "../program.module.css";
import SAMPLE_DATA from "../devdata.json";

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

export default function FavoriteProgramsPage() {
  const { favorites, isLoading } = useFavorites();
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Filter programs to only show favorites
  const favoritePrograms = useMemo(() => {
    const filtered = SAMPLE.filter(program => favorites.has(program.id));
    
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
  }, [favorites, sortBy]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>Mín úrval</h1>
          </div>
        </header>
        <div className={styles.content}>
          <div className={styles.loading}>
            <p>Hleð uppáhalds dagskrám...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>Mín úrval</h1>
          <Link href="/programs" className={styles.backLink}>
            ← Til baka í dagskrárbanka
          </Link>
        </div>

        {favoritePrograms.length > 0 && (
          <div className={styles.headerBottom}>
            <div className={styles.resultSummary}>
              <p className={styles.resultCount}>
                {favoritePrograms.length} {favoritePrograms.length === 1 ? 'dagskrá' : 'dagskrár'}
              </p>
            </div>
            <div className={styles.sortContainer}>
              <ProgramSort value={sortBy} onChange={setSortBy} />
            </div>
          </div>
        )}
      </header>

      <div className={styles.content}>
        {favoritePrograms.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⭐</div>
            <h2 className={styles.emptyTitle}>Engar uppáhalds dagskrár ennþá</h2>
            <p className={styles.emptyDescription}>
              Skoðaðu dagskrábankann og bættu dagskrám í uppáhald með því að smella á stjörnuna.
            </p>
            <Link href="/programs" className={styles.emptyAction}>
              Skoða dagskrábanka
            </Link>
          </div>
        ) : (
          <ProgramGrid>
            {favoritePrograms.map((program) => (
              <ProgramCard
                key={program.id}
                id={program.id}
                name={program.name}
                description={program.description}
                image={program.image}
                author={program.author}
                workspace={program.workspace}
                tags={program.tags?.map(tag => ({ id: tag, name: tag })) || []}
                like_count={program.like_count}
                created_at={program.created_at}
                public={program.public}
              />
            ))}
          </ProgramGrid>
        )}
      </div>
    </div>
  );
}
