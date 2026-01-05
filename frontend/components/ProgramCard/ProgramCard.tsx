"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./ProgramCard.module.css";

export interface ProgramCardProps {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  author?: {
    id: string;
    name: string;
  };
  workspace?: {
    id: string;
    name: string;
  };
  tags?: Array<{ id: string; name: string }>;
  like_count?: number;
  created_at?: string;
  public?: boolean;
  onLike?: (programId: string) => void;
  isLiked?: boolean;
  className?: string;
}

export default function ProgramCard({
  id,
  name,
  description,
  image,
  author,
  workspace,
  tags = [],
  like_count = 0,
  onLike,
  isLiked = false,
  className,
}: ProgramCardProps) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    router.push(`/programs/${id}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLike) {
      onLike(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      router.push(`/programs/${id}`);
    }
  };

  return (
    <article
      className={`${styles.card} ${className || ''}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View program: ${name}`}
      data-program-id={id}
    >
      {/* Thumbnail/Hero Image */}
      <div className={styles.media}>
        {image ? (
          <img src={image} alt={name} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <svg
              className={styles.placeholderIcon}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Title */}
        <h3 className={styles.title}>{name}</h3>

        {/* Author byline */}
        {author && (
          <p className={styles.byline}>
            by <span className={styles.authorName}>{author.name}</span>
          </p>
        )}

        {/* Description */}
        {description && <p className={styles.description}>{description}</p>}

        {/* Tags */}
        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.slice(0, 4).map((tag) => (
              <span key={tag.id} className={styles.tag}>
                {tag.name}
              </span>
            ))}
            {tags.length > 4 && (
              <span className={styles.tagMore}>+{tags.length - 4}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer Meta */}
      <div className={styles.footer}>
        {/* Like button */}
        <button
          className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
          onClick={handleLike}
          aria-label={isLiked ? 'Unlike this program' : 'Like this program'}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          <span className={styles.heartIcon} aria-hidden="true">
            {isLiked ? '❤️' : '🤍'}
          </span>
          <span className={styles.likeCount}>{like_count}</span>
        </button>

        {/* Read more button */}
        <button
          className={styles.readMore}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/programs/${id}`);
          }}
          aria-label={`Read more about ${name}`}
        >
          Read More
          <svg
            className={styles.arrow}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}
