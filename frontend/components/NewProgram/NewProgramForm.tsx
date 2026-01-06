"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./NewProgramForm.module.css";
import type { Program as ProgramType } from "@/hooks/usePrograms";
import { useTags } from "@/hooks/useTags";

type Props = {
  onCreated?: (program: ProgramType) => void;
  onCancel?: () => void;
  endpoint?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function NewProgramForm({ onCreated, onCancel, endpoint = "/programs" }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const imagePreviewRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    imagePreviewRef.current = imagePreview;
  }, [imagePreview]);

  React.useEffect(() => {
    return () => {
      // Revoke object URL on unmount
      if (imagePreviewRef.current) {
        try { URL.revokeObjectURL(imagePreviewRef.current); } catch { /* ignore */ }
      }
    };
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get available tags
  const { tags: availableTags } = useTags();
  
  // Placeholder tags for development
  const PLACEHOLDER_TAGS = ["útivist", "innileikur", "list", "sköpun", "matreiðsla", "leikur", "fræðsla", "náttúrufræði"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      setError("Heiti hugmyndar er nauðsynlegt");
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (description.trim()) formData.append("description", description.trim());
      formData.append("public", String(isPublic));
      if (image.trim()) formData.append("image", image.trim());
      if (imageFile) formData.append("imageFile", imageFile);
      
      // Add tags as JSON array
      if (selectedTags.length > 0) {
        formData.append("tags", JSON.stringify(selectedTags));
      }

      const url = new URL(endpoint, API_BASE).toString();
      const res = await fetch(url, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Villa kom upp: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const program: ProgramType = Array.isArray(data) ? data[0] : data;
      
      // Reset form
      handleReset();
      
      onCreated?.(program);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Óþekkt villa kom upp");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setIsPublic(false);
    setImage("");
    setSelectedTags([]);
    if (imagePreview) {
      try { URL.revokeObjectURL(imagePreview); } catch { /* ignore */ }
    }
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous preview
    if (imagePreview) {
      try { URL.revokeObjectURL(imagePreview); } catch { /* ignore */ }
    }

    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      try { URL.revokeObjectURL(imagePreview); } catch { /* ignore */ }
    }
    setImageFile(null);
    setImagePreview(null);
    setImage("");
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const displayTags = availableTags.length > 0 ? availableTags : PLACEHOLDER_TAGS;

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Ný dagskrá">
      {/* Program Name */}
      <div className={styles.field}>
        <label htmlFor="program-name" className={styles.label}>
          Heiti hugmyndar <span className={styles.required}>*</span>
        </label>
        <input
          id="program-name"
          type="text"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="t.d. Náttúruganga í skóginum"
          required
          maxLength={255}
        />
        <p className={styles.hint}>Stuttur og lýsandi titill á dagskrárhugmyndinni</p>
      </div>

      {/* Description */}
      <div className={styles.field}>
        <label htmlFor="program-description" className={styles.label}>
          Lýsing
        </label>
        <textarea
          id="program-description"
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Lýstu hugmyndinni stuttlega..."
          rows={4}
          maxLength={1000}
        />
        <p className={styles.hint}>Stutt lýsing sem hjálpar öðrum að skilja verkefnið</p>
      </div>

      {/* Tags */}
      <div className={styles.field}>
        <label className={styles.label}>
          Merkimiðar
        </label>
        <div className={styles.tagGrid}>
          {displayTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                className={`${styles.tagButton} ${isSelected ? styles.tagButtonActive : ''}`}
                onClick={() => handleTagToggle(tag)}
                aria-pressed={isSelected}
              >
                {tag}
              </button>
            );
          })}
        </div>
        {selectedTags.length > 0 && (
          <p className={styles.hint}>{selectedTags.length} merkimiði valinn</p>
        )}
      </div>

      {/* Image */}
      <div className={styles.field}>
        <label className={styles.label}>
          Mynd
        </label>
        
        {imagePreview ? (
          <div className={styles.imagePreview}>
            <Image 
              src={imagePreview} 
              alt="Preview" 
              width={400} 
              height={250}
              className={styles.previewImage}
            />
            <button
              type="button"
              className={styles.removeImage}
              onClick={handleRemoveImage}
              aria-label="Fjarlægja mynd"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className={styles.imageUpload}>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
            <label htmlFor="image-upload" className={styles.uploadLabel}>
              <svg className={styles.uploadIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={styles.uploadText}>Smelltu til að velja mynd</span>
              <span className={styles.uploadHint}>eða dragðu mynd hingað</span>
            </label>
          </div>
        )}
        
        {/* Image URL fallback */}
        <div className={styles.orDivider}>
          <span>eða</span>
        </div>
        <input
          type="url"
          className={styles.input}
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://example.com/mynd.jpg"
        />
        <p className={styles.hint}>Settu inn vefslóð á mynd</p>
      </div>

      {/* Public Toggle */}
      <div className={styles.field}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <span>Gera þessa hugmynd opinbera</span>
        </label>
        <p className={styles.hint}>Opinberar hugmyndir eru sýnilegar öllum í dagskrábankanum</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      {/* Form Actions */}
      <div className={styles.actions}>
        {onCancel && (
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={onCancel}
            disabled={loading}
          >
            Hætta við
          </button>
        )}
        <button
          type="button"
          className={styles.buttonSecondary}
          onClick={handleReset}
          disabled={loading}
        >
          Hreinsa
        </button>
        <button
          type="submit"
          className={styles.buttonPrimary}
          disabled={loading || !name.trim()}
        >
          {loading ? "Býr til..." : "Búa til hugmynd"}
        </button>
      </div>
    </form>
  );
}
