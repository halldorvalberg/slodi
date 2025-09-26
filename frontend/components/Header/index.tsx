"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  // Close on ESC and lock scroll when open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-background)] text-[var(--color-foreground)] border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-medium">Slóði</Link>

        <nav className="hidden md:flex gap-6">
          <Link className="inline-flex items-center gap-1 hover:underline" href="/">Heim</Link>
          <Link className="inline-flex items-center gap-1 hover:underline" href="/about">Um Slóða</Link>
          <Link className="inline-flex items-center gap-1 hover:underline" href="/auth/login">Log in</Link>
          <Link
            href="https://github.com/halldorvalberg/slodi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:underline"
          >
            Github
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-md border"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Overlay (click to close) */}
      {open && (
        <button
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Slide-in drawer */}
      <aside
        className={[
          "fixed inset-y-0 right-0 z-50 w-2/3 max-w-xs bg-[var(--color-background)]",
          "shadow-2xl md:hidden",
          "transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div className="p-4">
          <nav className="flex flex-col">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
            >
              Heim
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
            >
              Um Slóða
            </Link>
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
            >
              Log in
            </Link>
            <Link
              href="https://github.com/halldorvalberg/slodi" target="_blank" rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
            >
              Github
            </Link>
          </nav>
        </div>
      </aside>
    </header>
  );
}
