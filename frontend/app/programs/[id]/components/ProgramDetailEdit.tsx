"use client";

import React, { useState } from "react";
import type { Program } from "@/services/programs.service";
import styles from "./ProgramDetailEdit.module.css";

export interface ProgramUpdateFormData {
  name: string;
  description: string | null;
  public: boolean;
}

interface ProgramDetailEditProps {
  program: Program;
  onSave: (data: ProgramUpdateFormData) => Promise<void>;
  onCancel: () => void;
  onDelete: () => Promise<void>; 
  isDeleting: boolean;
}

export default function ProgramDetailEdit({
  program,
  onSave,
  onCancel,
  onDelete,
  isDeleting
}: ProgramDetailEditProps) {
  const [formData, setFormData] = useState<ProgramUpdateFormData>({
    name: program.name,
    description: program.description || null,
    public: program.public,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Nafn má ekki vera tómt");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await onSave(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Villa kom upp við að vista");
    } finally {
      setIsSaving(false);
    }
  };

  const isDisabled = isSaving || isDeleting;

  return (
    <div className={styles.editContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Nafn dagskrár *
          </label>
          <input
            id="name"
            type="text"
            className={styles.input}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={isDisabled}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Lýsing
          </label>
          <textarea
            id="description"
            className={styles.textarea}
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
            rows={8}
            disabled={isDisabled}
            placeholder="Lýsing á dagskránni..."
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={formData.public}
              onChange={(e) => setFormData({ ...formData, public: e.target.checked })}
              disabled={isDisabled}
            />
            <span>Opinber dagskrá</span>
          </label>
          <p className={styles.helpText}>
            Openberar dagskrár eru sýnilegar öllum í dagskrárbankanum
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isDisabled}
          >
            {isSaving ? "Vista..." : "Vista breytingar"}
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isDisabled}
          >
            Hætta við
          </button>
        </div>

        {/* Delete section - separated from main actions */}
        <div className={styles.dangerZone}>
          <h3 className={styles.dangerTitle}>Hættusvæði</h3>
          <p className={styles.dangerDescription}>
            Þegar dagskrá er eytt er ekki hægt að afturkalla það.
          </p>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={onDelete}
            disabled={isDisabled}
          >
            {isDeleting ? "Eyði..." : "Eyða dagskrá"}
          </button>
        </div>
      </form>
    </div>
  );
}