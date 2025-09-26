"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AccountButton from "../AccountButton";

type User = { name: string; picture: string | null; email: string | null } | null;

export default function MobileNav({ user }: { user: User }) {
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
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-md border"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? "✕" : "☰"}
      </button>

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
          <nav className="flex flex-col gap-1">
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
            <div className="px-1 py-2">
              <AccountButton user={user} compact />
            </div>
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
    </>
  );
}
