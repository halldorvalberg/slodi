"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./header.module.css";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  function openDrawer() {
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Slóði
        </Link>

        <nav className={styles.nav + " desktopNav"}>
          <Link href="/" className={styles.navLink}>
            Heim
          </Link>
          <Link href="/about" className={styles.navLink}>
            Um Slóða
          </Link>
          <a
            href="https://github.com/halldorvalberg/slodi"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            Github
          </a>
        </nav>

        <button className={styles.hamburger} onClick={openDrawer} aria-label="Open menu">
          ☰
        </button>

        {/* Drawer */}
        {drawerOpen && <div className={styles.overlay} onClick={closeDrawer} />}
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
            <a
              href="https://github.com/halldorvalberg/slodi"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.drawerLink}
              onClick={closeDrawer}
            >
              Github
            </a>
          </nav>
        </aside>
      </div>
    </header>
  );
}

