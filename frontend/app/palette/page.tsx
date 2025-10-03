"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import styles from "./palette.module.css";

// Small helper
function cx(...parts: Array<string | undefined | false>) {
    return parts.filter(Boolean).join(" ");
}

/** Simple card shell */
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => (
    <div className={cx(styles.card, className)}>{children}</div>
);

const Section: React.FC<React.PropsWithChildren<{ title: string; subtitle?: string }>> = ({ title, subtitle, children }) => (
    <section className={styles.section}>
        <div>
            <h2 className={styles.sectionTitle}>{title}</h2>
            {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
        </div>
        {children}
    </section>
);

/** Swatch using CSS variables directly */
const Swatch: React.FC<{ name: string; bgToken: string; note?: string }> = ({ name, bgToken, note }) => {
    const [cssValue, setCssValue] = useState<string>("");
    const id = useId();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            const color = getComputedStyle(ref.current).backgroundColor;
            setCssValue(color);
        }
    }, []);

    return (
        <div className={styles.swatch}>
            <div
                ref={ref}
                id={id}
                className={styles.swatchBlock}
                style={{ background: `hsl(var(${bgToken}))` }}
                aria-label={`${name} swatch`}
            />
            <div className={styles.swatchMeta}>
                <div className={styles.swatchRow}>
                    <span className={styles.swatchName}>{name}</span>
                    <code className={styles.swatchCode}>{cssValue}</code>
                </div>
                {note && <div className={styles.swatchNote}>{note}</div>}
            </div>
        </div>
    );
};

/** Buttons use tokens */
const UIButton: React.FC<{
    variant?: "primary" | "secondary" | "ghost" | "outline";
    children: React.ReactNode;
}> = ({ variant = "primary", children }) => {
    if (variant === "primary") {
        return <button className={cx(styles.btn, styles.btnPrimary)}>{children}</button>;
    }
    if (variant === "secondary") {
        return <button className={cx(styles.btn, styles.btnSecondary)}>{children}</button>;
    }
    if (variant === "outline") {
        return <button className={cx(styles.btn, styles.btnOutline)}>{children}</button>;
    }
    return <button className={cx(styles.btn, styles.btnGhost)}>{children}</button>;
};

/** Banners use semantic tokens */
const UIBanner: React.FC<{ tone: "success" | "warning" | "error" | "info"; title: string; body: string }> = ({
    tone,
    title,
    body,
}) => {
    const toneClass =
        tone === "success"
            ? styles.bannerSuccess
            : tone === "warning"
                ? styles.bannerWarning
                : tone === "error"
                    ? styles.bannerError
                    : styles.bannerInfo;

    return (
        <div className={cx(styles.banner, toneClass)}>
            <div className={styles.bannerTitle}>{title}</div>
            <div className={styles.bannerBody}>{body}</div>
        </div>
    );
};

/** Dark mode toggle adds or removes .dark on <html> */
const ToggleDark: React.FC = () => {
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
    }, []);
    const toggle = () => {
        document.documentElement.classList.toggle("dark");
        setIsDark((v) => !v);
    };
    return (
        <button onClick={toggle} className={cx(styles.btn, styles.btnOutline)}>
            {isDark ? "Switch to Light" : "Switch to Dark"}
        </button>
    );
};

export default function PalettePage() {
    const forest = [
        { name: "Moss", token: "--primary" }, // maps to your Moss
        { name: "Pine", token: "--secondary" }, // Pine as secondary
        { name: "Bark", token: "--border" },
        { name: "Birch", token: "--background" },
        { name: "Charcoal", token: "--foreground" },
    ];

    const playful = [
        { name: "Sky Mist", token: "--muted" },
        { name: "Campfire", token: "--warning" },
        { name: "Mint", token: "--info" }, // repurposed to show another playful hue
    ];

    const scouts = [
        { name: "Dreka", token: "--accent-dreka", note: "Patrol accent" },
        { name: "Fálka", token: "--accent-falka", note: "Patrol accent" },
        { name: "Drótt", token: "--accent-drott", note: "Patrol accent" },
        { name: "Rekka", token: "--accent-rekka", note: "Patrol accent" },
        { name: "Róver", token: "--accent-rover", note: "Patrol accent" },
        { name: "Adrir", token: "--accent-adrir", note: "Patrol accent" },
    ];

    const systemRoles = [
        { title: "Background", bg: "--background", fg: "--foreground" },
        { title: "Primary", bg: "--primary", fg: "--primary-foreground" },
        { title: "Secondary", bg: "--secondary", fg: "--secondary-foreground" },
    ];

    const comboBackgrounds = ["--background", "--background", "--muted", "--primary", "--secondary", "--border", "--foreground"];
    const comboTexts = ["--foreground", "--foreground", "--primary", "--primary-foreground", "--background", "--background"];

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <h1 className={styles.pageTitle}>Palette Showcase</h1>
                    <div className={styles.headerActions}>
                        <ToggleDark />
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                <Section title="System Roles" subtitle="Base surfaces and action colors derived from forest palette">
                    <div className={styles.grid3}>
                        {systemRoles.map((r) => (
                            <Card key={r.title}>
                                <div
                                    className={styles.roleHead}
                                    style={{
                                        background: `hsl(var(${r.bg}))`,
                                        color: `hsl(var(${r.fg}))`,
                                    }}
                                >
                                    <div className={styles.roleLabel}>{r.title}</div>
                                    <div className={styles.roleGlyph}>Aa</div>
                                    <div className={styles.roleButtons}>
                                        <UIButton variant="primary">Primary</UIButton>
                                        <UIButton variant="secondary">Secondary</UIButton>
                                        <UIButton variant="outline">Outline</UIButton>
                                    </div>
                                </div>
                                <div className={styles.roleBody}>
                                    <p className={styles.muted}>Use for {r.title.toLowerCase()} surfaces and components.</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Section>

                <Section title="Forest Neutrals">
                    <div className={styles.grid5}>
                        {forest.map((c) => (
                            <Swatch key={c.name} name={c.name} bgToken={c.token} />
                        ))}
                    </div>
                </Section>

                <Section title="Playful Neutrals">
                    <div className={styles.grid6}>
                        {playful.map((c) => (
                            <Swatch key={c.name} name={c.name} bgToken={c.token} />
                        ))}
                    </div>
                </Section>

                <Section title="Scout Patrol Accents" subtitle="Use for teams, badges, status ribbons, and gamified UI">
                    <div className={styles.grid6}>
                        {scouts.map((c) => (
                            <Swatch key={c.name} name={c.name} bgToken={c.token} note={c.note} />
                        ))}
                    </div>
                </Section>

                <Section title="Semantic Banners">
                    <div className={styles.grid2}>
                        <UIBanner tone="success" title="Success" body="Action completed successfully." />
                        <UIBanner tone="warning" title="Warning" body="Heads up: check this before proceeding." />
                        <UIBanner tone="error" title="Error" body="Something went wrong. Please retry." />
                        <UIBanner tone="info" title="Info" body="This is additional context for users." />
                    </div>
                </Section>

                <Section title="Combinations Matrix" subtitle="Common background and text pairings to inspect readability">
                    <div className={styles.grid2}>
                        {comboBackgrounds.map((bg, i) => (
                            <Card key={i}>
                                <div className={styles.comboHead} style={{ background: `hsl(var(${bg}))` }}>
                                    <div className={styles.comboGrid}>
                                        {comboTexts.map((txt, j) => (
                                            <div
                                                key={j}
                                                className={styles.comboCell}
                                                style={{ color: `hsl(var(${txt}))`, background: `hsl(var(${bg}))` }}
                                            >
                                                <div className={styles.comboLabel}>
                                                    {bg.replace("--", "")} / {txt.replace("--", "")}
                                                </div>
                                                <p className={styles.comboSample}>Sphinx of black quartz, judge my vow.</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.cardNote}>Background: {bg}</div>
                            </Card>
                        ))}
                    </div>
                </Section>

                <Section title="Patrol on Neutrals" subtitle="How accents behave on neutral surfaces">
                    <div className={styles.grid2}>
                        {["--background", "--muted", "--background"].map((bg) => (
                            <Card key={bg}>
                                <div className={styles.patrolHead} style={{ background: `hsl(var(${bg}))` }}>
                                    <div className={styles.patrolGrid}>
                                        {scouts.map((s) => (
                                            <div
                                                key={s.name}
                                                className={styles.patrolCell}
                                                style={{
                                                    background: `hsl(var(${s.token}))`,
                                                    color: `hsl(var(--primary-foreground))`,
                                                }}
                                            >
                                                <div className={styles.patrolName}>{s.name}</div>
                                                <p className={styles.patrolDesc}>Badge or CTA or Tag</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.cardNote}>Background: {bg}</div>
                            </Card>
                        ))}
                    </div>
                </Section>
            </main>

            <footer className={styles.footer}>
                Built with tokenized HSL variables. Toggle dark mode to preview both themes.
            </footer>
        </div>
    );
}
