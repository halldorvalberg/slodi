import React from "react";
import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>404</h1>
                <h2 className={styles.subtitle}>Dagskrá finnst ekki</h2>
                <p className={styles.message}>
                    Því miður finnst þessi dagskrá ekki. Hún gæti hafa verið fjarlægð eða þú ert með rangan hlekk.
                </p>
                <div className={styles.actions}>
                    <Link href="/programs" className={styles.primaryButton}>
                        Til baka í dagskrárlista
                    </Link>
                    <Link href="/" className={styles.secondaryButton}>
                        Fara á forsíðu
                    </Link>
                </div>
            </div>
        </div>
    );
}
