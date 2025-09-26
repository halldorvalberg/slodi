import Link from "next/link";
import { auth0 } from "@/lib/auth0";
import AccountButton from "../AccountButton";
import MobileNav from "../MobileNav";

type LeanUser = { name: string; picture: string | null; email: string | null } | null;

export default async function Header() {
  const session = await auth0.getSession();
  const user: LeanUser = session?.user
    ? {
      name: session.user.name ?? session.user.nickname ?? "Account",
      picture: session.user.picture ?? null,
      email: session.user.email ?? null,
    }
    : null;

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-background)] text-[var(--color-foreground)] border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <Link href="/" className="font-medium">Slóði</Link>

        <nav className="ml-auto hidden md:flex items-center gap-6">
          <Link className="inline-flex items-center gap-1 hover:underline" href="/">Heim</Link>
          <Link className="inline-flex items-center gap-1 hover:underline" href="/about">Um Slóða</Link>
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
          <AccountButton user={user} />
        </nav>

        {/* Mobile: hamburger sits on the right; include AccountButton inside the sheet */}
        <div className="ml-auto md:hidden flex items-center gap-2">
          <MobileNav user={user} />
        </div>
      </div>
    </header>
  );
}

