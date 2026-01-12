"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { programUpdateSchema, type ProgramUpdateFormData } from "@/lib/validation";
import type { Program } from "@/services/programs.service";
import styles from "./ProgramDetailEdit.module.css";

interface ProgramDetailEditProps {
  program: Program;
  onSave: (data: ProgramUpdateFormData) => Promise<void>;
  onCancel: () => void;
}

export default function ProgramDetailEdit({
  program,
  onSave,
  onCancel,
}: ProgramDetailEditProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(program.public);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<ProgramUpdateFormData>({
    resolver: zodResolver(programUpdateSchema),
    defaultValues: {
      name: program.name,
      description: program.description || "",
      public: program.public,
    },
  });

  // Update form value when toggle changes
  React.useEffect(() => {
    setValue("public", isPublic, { shouldDirty: true });
  }, [isPublic, setValue]);

  const onSubmit = async (data: ProgramUpdateFormData) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      await onSave(data);
    } catch (error) {
      console.error("Failed to save program:", error);
      setSaveError(
        error instanceof Error
          ? error.message
          : "Ekki tókst að vista breytingar. Reyndu aftur."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.editForm}>
      {/* Form Header */}
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Breyta dagskrá</h2>
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className={styles.cancelButton}
          >
            Hætta við
          </button>
          <button
            type="submit"
            disabled={isSaving || !isDirty}
            className={styles.saveButton}
          >
            {isSaving ? "Vistar..." : "Vista"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {saveError && (
        <div className={styles.errorMessage} role="alert">
          <span className={styles.errorIcon}>⚠️</span>
          <span>{saveError}</span>
        </div>
      )}

      {/* Program Name */}
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Nafn dagskrár <span className={styles.required}>*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
          placeholder="T.d. Haustdagskrá 2026"
          disabled={isSaving}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className={styles.fieldError} role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Lýsing
        </label>
        <textarea
          id="description"
          {...register("description")}
          className={`${styles.textarea} ${
            errors.description ? styles.inputError : ""
          }`}
          placeholder="Lýstu dagskránni þinni..."
          rows={6}
          disabled={isSaving}
          aria-invalid={errors.description ? "true" : "false"}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        {errors.description && (
          <p id="description-error" className={styles.fieldError} role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Public/Private Toggle */}
      <div className={styles.formGroup}>
        <div className={styles.toggleContainer}>
          <div className={styles.toggleHeader}>
            <div className={styles.toggleIcon}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
                  fill="currentColor"
                  opacity="0.5"
                />
                <path
                  d="M10 4c-3.31 0-6 2.69-6 6s2.69 6 6 6V4z"
                  fill="currentColor"
                />
              </svg>
              <div className={styles.toggleLabels}>
                <span className={styles.toggleTitle}>Sýnileiki dagskrár</span>
                <span className={styles.toggleStatus}>
                  {isPublic ? 'Opinber' : 'Einka'}
                </span>
              </div>
            </div>
            <label className={styles.switchLabel}>
              <input
                type="checkbox"
                className={styles.switchInput}
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={isSaving}
                aria-label="Gera dagskrá opinbera"
              />
              <span className={styles.switch}>
                <span className={styles.switchThumb}></span>
              </span>
            </label>
          </div>
          <p className={styles.toggleHint}>
            {isPublic
              ? 'Þessi dagskrá verður sýnileg öllum'
              : 'Þessi dagskrá verður aðeins sýnileg þér og þínu vinnusvæði'
            }
          </p>
        </div>
        {errors.public && (
          <p className={styles.fieldError} role="alert">
            {errors.public.message}
          </p>
        )}
      </div>

      {/* Form Footer (Mobile-friendly buttons) */}
      <div className={styles.formFooter}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className={styles.cancelButtonMobile}
        >
          Hætta við
        </button>
        <button
          type="submit"
          disabled={isSaving || !isDirty}
          className={styles.saveButtonMobile}
        >
          {isSaving ? "Vistar..." : "Vista breytingar"}
        </button>
      </div>
    </form>
  );
}
