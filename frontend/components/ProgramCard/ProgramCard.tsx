"use client";

import React from "react";
import styles from "./ProgramCard.module.css";

type ProgramCardProps = {
  id: string | number;
  title: string;
  description?: string;
  tags?: string[];
};

export default function ProgramCard({ id, title, description, tags = [] }: ProgramCardProps) {
  return (
    <article className={styles.card} data-id={id}>
      <div className={styles.media}>Brot af dagskrá</div>
      <h3 className={styles.title}>{title}</h3>
      {description ? <p className={styles.desc}>{description}</p> : null}
      <div className={styles.meta}>
        <div className={styles.tags}>
          {tags.slice(0,4).map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
        <button className={styles.cta} aria-label={`Open ${title}`}>Opna</button>
      </div>
    </article>
  );
}
