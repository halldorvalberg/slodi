"use client";

import Link from "next/link";
import { auth0 } from "@/lib/auth0";
import AccountButton from "@/components/AccountButton";
import MobileNav from "@/components/MobileNav";

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
    <header className="sticky top-0 z-50 bg-[var(--color-background)] text-[var(--color-foreground)] border-b font-sans">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <Link href="/" className="font-medium">Slóði</Link>

      <aside
        id="menu-drawer"
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}
        aria-hidden={!drawerOpen}
      >
        <nav className={styles.drawerNav}>
          <Link href="/" className={styles.drawerLink} onClick={closeDrawer}>
            Heim
          </Link>
          <Link href="/about" className={styles.drawerLink} onClick={closeDrawer}>
            Um Slóða
          </Link>
          <Link
            href="https://github.com/halldorvalberg/slodi"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.drawerLink}
            onClick={closeDrawer}
          >
            Github
          </Link>
        </nav>
      </aside>
    </header>
  );
}

