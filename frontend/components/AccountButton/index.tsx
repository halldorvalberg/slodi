"use client";

import { useState } from "react";

type User = { name: string; picture: string | null; email: string | null } | null;

type Props = {
  user: User;
  compact?: boolean;
};

export default function AccountButton({ user, compact }: Props) {
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <a
        href="/auth/login"
        aria-label="Log in"
        className="inline-flex items-center justify-center rounded-full border hover:bg-muted focus:outline-none focus:ring px-2 py-2"
      >
        <UserIcon className={compact ? "h-5 w-5" : "h-6 w-6"} />
      </a>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="inline-flex items-center justify-center rounded-full border hover:bg-muted focus:outline-none focus:ring p-0"
        style={{ width: compact ? 28 : 32, height: compact ? 28 : 32 }}
      >
        <Avatar picture={user.picture} name={user.name ?? "Account"} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 mt-2 w-56 rounded-xl border bg-popover shadow-lg p-1 z-50"
        >
          <div className="px-3 py-2">
            <p className="text-sm font-medium truncate">{user.name ?? "Account"}</p>
            {user.email && (
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            )}
          </div>
          <a
            href="/dashboard"
            role="menuitem"
            className="block rounded-lg px-3 py-2 text-sm hover:bg-accent"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </a>
          <div className="h-px bg-border my-1" />
          <a
            href="/auth/logout"
            role="menuitem"
            className="block rounded-lg px-3 py-2 text-sm hover:bg-accent"
            onClick={() => setOpen(false)}
          >
            Log out
          </a>
        </div>
      )}
    </div>
  );
}

function Avatar({ picture, name }: { picture: string | null; name: string }) {
  if (!picture) {
    return (
      <span className="grid place-items-center rounded-full bg-muted text-muted-foreground">
        <UserIcon className="h-4 w-4" />
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={picture}
      alt={name}
      className="rounded-full object-cover w-full h-full"
      referrerPolicy="no-referrer"
    />
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-6 w-6"}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.5 18.5a7 7 0 0 1 11 0" />
    </svg>
  );
}
