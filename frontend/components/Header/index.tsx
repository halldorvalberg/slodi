"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import styles from "./header.module.css";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = useCallback(() => {
    setDrawerOpen((prev) => !prev);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Slóði
        </Link>
        <div className={styles.desktopNav}>
          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>
              Heim
            </Link>
            <Link href="/about" className={styles.navLink}>
              Um Slóða
            </Link>
            <Link
              href="https://github.com/halldorvalberg/slodi"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navLink}
            >
              Github
            </Link>
          </nav>
        </div>

        <button
          className={styles.hamburger}
          onClick={toggleDrawer}
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={drawerOpen}
          aria-controls="menu-drawer"
        >
          {drawerOpen ? "✕" : "☰"}
        </button>
      </div>

      {drawerOpen && (
        <div
          className={styles.overlay}
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

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
