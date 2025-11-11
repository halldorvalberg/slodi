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
                aria-label={`${name} litasýni`}
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
            {isDark ? "Skipta í ljóst" : "Skipta í dökkt"}
        </button>
    );
};

export default function PalettePage() {
    const forest = [
        { name: "Mosi", token: "--primary" },
        { name: "Fura", token: "--secondary" },
        { name: "Börkur", token: "--border" },
        { name: "Birki", token: "--background" },
        { name: "Kol", token: "--foreground" },
    ];

    const playful = [
        { name: "Skýmóða", token: "--muted" },
        { name: "Bál", token: "--warning" },
        { name: "Mynta", token: "--info" },
    ];

    const scouts = [
        { name: "Drekar", token: "--drekar", fg: "--on-drekar", note: "Sveitarlitur" },
        { name: "Fálkar", token: "--falkar", fg: "--on-falkar", note: "Sveitarlitur" },
        { name: "Drótt", token: "--drott", fg: "--on-drott", note: "Sveitarlitur" },
        { name: "Rekkar", token: "--rekkar", fg: "--on-rekkar", note: "Sveitarlitur" },
        { name: "Róver", token: "--rover", fg: "--on-rover", note: "Sveitarlitur" },
        { name: "Aðrir", token: "--adrir", fg: "--on-adrir", note: "Sveitarlitur" },
    ];

    const systemRoles = [
        { title: "Bakgrunnur", bg: "--background", fg: "--foreground" },
        { title: "Aðallitur", bg: "--primary", fg: "--primary-foreground" },
        { title: "Aukalitur", bg: "--secondary", fg: "--secondary-foreground" },
    ];

    const comboBackgrounds = ["--background", "--background", "--muted", "--primary", "--secondary", "--border", "--foreground"];
    const comboTexts = ["--foreground", "--foreground", "--primary", "--primary-foreground", "--background", "--background"];

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <h1 className={styles.pageTitle}>Litir og samsetningar</h1>
                    <div className={styles.headerActions}>
                        <ToggleDark />
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                <Section title="Kerfislitir" subtitle="Grunnyfirborð og aðgerðarlitir út frá skógarpallettu">
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
                                        <UIButton variant="primary">Aðgerð</UIButton>
                                        <UIButton variant="secondary">Aukaaðgerð</UIButton>
                                        <UIButton variant="outline">Útlína</UIButton>
                                    </div>
                                </div>
                                <div className={styles.roleBody}>
                                    <p className={styles.muted}>Nota fyrir {r.title.toLowerCase()} yfirborð og íhluti.</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Section>

                <Section title="Skógarhlutlausir" subtitle="Nota fyrir bakgrunn, kort, töflur og aðra hlutlausa flöt">
                    <div className={styles.grid5}>
                        {forest.map((c) => (
                            <Swatch key={c.name} name={c.name} bgToken={c.token} />
                        ))}
                    </div>
                </Section>

                <Section title="Skemmtilegir litir" subtitle="Nota fyrir ábendingar, tilkynningar og áherslur">
                    <div className={styles.grid6}>
                        {playful.map((c) => (
                            <Swatch key={c.name} name={c.name} bgToken={c.token} />
                        ))}
                    </div>
                </Section>

                <Section title="Skátasveitarlitir" subtitle="Notað til að greina sveitir út frá litum þeirra. Byggir á litastaðli Bandalagsins">
                    <div className={styles.grid6}>
                        {scouts.map((c) => (
                            <Card key={c.name} className={styles.swatch}>
                                <div
                                    className={styles.swatchBlock}
                                    style={{ background: `var(${c.token})` }}
                                    aria-label={`${c.name} litasýni`}
                                />
                                <div className={styles.swatchMeta}>
                                    <div className={styles.swatchRow}>
                                        <span className={styles.swatchName}>{c.name}</span>
                                        <code className={styles.swatchCode}>
                                            {`var(${c.token})`}
                                        </code>
                                    </div>
                                    {c.note && <div className={styles.swatchNote}>{c.note}</div>}
                                </div>
                            </Card>
                        ))}
                    </div>
                </Section>

                <Section title="Túlkun skilaboða">
                    <div className={styles.grid2}>
                        <UIBanner tone="success" title="Tókst" body="Aðgerð kláraðist án vandræða." />
                        <UIBanner tone="warning" title="Aðvörun" body="Athugaðu þetta áður en þú heldur áfram." />
                        <UIBanner tone="error" title="Villa" body="Eitthvað fór úrskeiðis. Reyndu aftur." />
                        <UIBanner tone="info" title="Upplýsingar" body="Hér eru viðbótarupplýsingar fyrir notendur." />
                    </div>
                </Section>

                <Section title="Samsetningar" subtitle="Algengar samsetningar bakgrunns og texta til að meta læsileika">
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
                                                <p className={styles.comboSample}>Kæmi ný öxi hér, ykist þjófum nú bæði víl og ádrepa.</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.cardNote}>Bakgrunnur: {bg}</div>
                            </Card>
                        ))}
                    </div>
                </Section>



                <Section title="Sveitarlitir á aðallitum" subtitle="Hvernig sveitalitir hegða sér á aðallitum">
                    <div className={styles.grid2}>
                        {["--primary", "--secondary", "--background", "--muted"].map((bg) => (
                            <Card key={bg}>
                                <div className={styles.patrolHead} style={{ background: `hsl(var(${bg}))` }}>
                                    <div className={styles.patrolGrid}>
                                        {scouts.map((s) => (
                                            <div key={s.name} className={styles.patrolCell} style={{
                                                background: `var(${s.token})`,
                                                color: `var(${s.fg})`,
                                            }}>
                                                <div className={styles.patrolName}>{s.name}</div>
                                                <p className={styles.patrolDesc}>Merki eða aðgerðahnappur</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.cardNote}>Bakgrunnur: {bg.replace("--", "")}</div>
                            </Card>
                        ))}
                    </div>
                </Section>
            </main>



            <footer className={styles.footer}>
                Byggt á litaspilsbreytum í HSL. Prófaðu myrkan ham til að skoða bæði þemu.
            </footer>
        </div>
    );
}
