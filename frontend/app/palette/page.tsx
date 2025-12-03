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
const Swatch: React.FC<{ name: string; token: string; note?: string; showValue?: boolean }> = ({
    name,
    token,
    note,
    showValue = true
}) => {
    const [cssValue, setCssValue] = useState<string>("");
    const id = useId();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            const computed = getComputedStyle(ref.current);
            const bg = computed.backgroundColor;
            setCssValue(bg);
        }
    }, []);

    return (
        <div className={styles.swatch}>
            <div
                ref={ref}
                id={id}
                className={styles.swatchBlock}
                style={{ background: `hsl(var(${token}))` }}
                aria-label={`${name} litasýni`}
            />
            <div className={styles.swatchMeta}>
                <div className={styles.swatchRow}>
                    <span className={styles.swatchName}>{name}</span>
                </div>
                <code className={styles.swatchToken}>{token}</code>
                {showValue && <code className={styles.swatchCode}>{cssValue}</code>}
                {note && <div className={styles.swatchNote}>{note}</div>}
            </div>
        </div>
    );
};

/** Token inspector - shows token name and computed value */
const TokenInspector: React.FC<{ token: string; label: string; type?: 'color' | 'spacing' | 'text' }> = ({
    token,
    label,
    type = 'color'
}) => {
    const [value, setValue] = useState<string>("");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            const computed = getComputedStyle(document.documentElement);
            const val = computed.getPropertyValue(token).trim();
            setValue(val);
        }
    }, [token]);

    return (
        <div className={styles.tokenInspector} ref={ref}>
            <div className={styles.tokenLabel}>{label}</div>
            <div className={styles.tokenDetails}>
                <code className={styles.tokenName}>{token}</code>
                <code className={styles.tokenValue}>{value}</code>
            </div>
            {type === 'color' && (
                <div
                    className={styles.tokenPreview}
                    style={{ background: `hsl(var(${token}))` }}
                />
            )}
            {type === 'spacing' && (
                <div className={styles.tokenSpacingPreview}>
                    <div
                        className={styles.tokenSpacingBar}
                        style={{ width: `var(${token})` }}
                    />
                </div>
            )}
        </div>
    );
};

/** Buttons use Slóði tokens */
const UIButton: React.FC<{
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}> = ({ variant = "primary", size = "md", children }) => {
    const variantClass =
        variant === "primary" ? styles.btnPrimary :
            variant === "secondary" ? styles.btnSecondary :
                styles.btnGhost;

    const sizeClass =
        size === "sm" ? styles.btnSm :
            size === "lg" ? styles.btnLg :
                styles.btnMd;

    return (
        <button className={cx(styles.btn, variantClass, sizeClass)}>
            {children}
        </button>
    );
};

/** Alerts/Banners use semantic tokens */
const UIAlert: React.FC<{
    tone: "success" | "warning" | "error" | "info";
    title: string;
    body: string
}> = ({ tone, title, body }) => {
    const toneClass =
        tone === "success" ? styles.alertSuccess :
            tone === "warning" ? styles.alertWarning :
                tone === "error" ? styles.alertError :
                    styles.alertInfo;

    return (
        <div className={cx(styles.alert, toneClass)}>
            <div className={styles.alertTitle}>{title}</div>
            <div className={styles.alertBody}>{body}</div>
        </div>
    );
};

/** Patrol badge */
const PatrolBadge: React.FC<{ name: string; token: string; fgToken: string }> = ({
    name,
    token,
    fgToken
}) => {
    return (
        <span
            className={styles.patrolBadge}
            style={{
                background: `hsl(var(${token}))`,
                color: `hsl(var(${fgToken}))`
            }}
        >
            {name}
        </span>
    );
};

/** Dark mode toggle */
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
        <button onClick={toggle} className={cx(styles.btn, styles.btnSecondary)}>
            {isDark ? "☀️ Ljóst" : "🌙 Dökkt"}
        </button>
    );
};

/** Theme selector */
const ThemeSelector: React.FC = () => {
    const [theme, setTheme] = useState<string>("light");

    const themes = [
        { value: "light", label: "☀️ Ljóst", attr: null },
        { value: "dark", label: "🌙 Dökkt", attr: "dark" },
        { value: "forest-night", label: "🌲 Skóganótt", attr: "forest-night" },
        { value: "campfire", label: "🔥 Bál", attr: "campfire" },
        { value: "northern-lights", label: "✨ Norðurljós", attr: "northern-lights" }
    ];

    const handleChange = (newTheme: string) => {
        const selected = themes.find(t => t.value === newTheme);
        if (!selected) return;

        // Remove all themes
        document.documentElement.classList.remove("dark");
        document.documentElement.removeAttribute("data-theme");

        // Apply new theme
        if (selected.attr === "dark") {
            document.documentElement.classList.add("dark");
        } else if (selected.attr) {
            document.documentElement.setAttribute("data-theme", selected.attr);
        }

        setTheme(newTheme);
    };

    return (
        <div className={styles.themeSelector}>
            {themes.map(t => (
                <button
                    key={t.value}
                    onClick={() => handleChange(t.value)}
                    className={cx(
                        styles.themeButton,
                        theme === t.value && styles.themeButtonActive
                    )}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
};

export default function PalettePage() {
    // Nature colors (primitives shown as semantics)
    const natureColors = [
        { name: "Birki (Bakgrunnur)", token: "--sl-color-background", note: "Aðalbakgrunnur" },
        { name: "Mosi (Aðallitur)", token: "--sl-color-primary", note: "Aðalaðgerðir" },
        { name: "Fura (Aukalitur)", token: "--sl-color-secondary", note: "Aukaáhersla" },
        { name: "Börkur (Rammi)", token: "--sl-color-border", note: "Rammar og skil" },
        { name: "Yfirborð", token: "--sl-color-surface", note: "Kort og spjöld" }
    ];

    // Scout patrol colors
    const scouts = [
        {
            name: "Drekar",
            base: "--sl-color-patrol-drekar",
            fg: "--sl-color-patrol-drekar-foreground",
            hover: "--sl-color-patrol-drekar-hover",
            subtle: "--sl-color-patrol-drekar-subtle"
        },
        {
            name: "Fálkar",
            base: "--sl-color-patrol-falkar",
            fg: "--sl-color-patrol-falkar-foreground",
            hover: "--sl-color-patrol-falkar-hover",
            subtle: "--sl-color-patrol-falkar-subtle"
        },
        {
            name: "Drótt",
            base: "--sl-color-patrol-drott",
            fg: "--sl-color-patrol-drott-foreground",
            hover: "--sl-color-patrol-drott-hover",
            subtle: "--sl-color-patrol-drott-subtle"
        },
        {
            name: "Rekkar",
            base: "--sl-color-patrol-rekkar",
            fg: "--sl-color-patrol-rekkar-foreground",
            hover: "--sl-color-patrol-rekkar-hover",
            subtle: "--sl-color-patrol-rekkar-subtle"
        },
        {
            name: "Rover",
            base: "--sl-color-patrol-rover",
            fg: "--sl-color-patrol-rover-foreground",
            hover: "--sl-color-patrol-rover-hover",
            subtle: "--sl-color-patrol-rover-subtle"
        },
        {
            name: "Aðrir",
            base: "--sl-color-patrol-adrir",
            fg: "--sl-color-patrol-adrir-foreground",
            hover: "--sl-color-patrol-adrir-hover",
            subtle: "--sl-color-patrol-adrir-subtle"
        }
    ];

    // Semantic state colors
    const semanticColors = [
        { name: "Árangur", token: "--sl-color-success", subtle: "--sl-color-success-subtle" },
        { name: "Aðvörun", token: "--sl-color-warning", subtle: "--sl-color-warning-subtle" },
        { name: "Villa", token: "--sl-color-error", subtle: "--sl-color-error-subtle" },
        { name: "Upplýsingar", token: "--sl-color-info", subtle: "--sl-color-info-subtle" }
    ];

    // Text colors
    const textColors = [
        { name: "Aðaltexti", token: "--sl-color-text-primary" },
        { name: "Aukatexti", token: "--sl-color-text-secondary" },
        { name: "Þriðji texti", token: "--sl-color-text-tertiary" },
        { name: "Óvirkur", token: "--sl-color-text-disabled" },
        { name: "Tengill", token: "--sl-color-text-link" }
    ];

    // Spacing tokens
    const spacingTokens = [
        { name: "Síða", token: "--sl-spacing-page", value: "128px" },
        { name: "Hluti", token: "--sl-spacing-section", value: "96px" },
        { name: "Gámur", token: "--sl-spacing-container", value: "64px" },
        { name: "Íhlutur", token: "--sl-spacing-component", value: "24px" },
        { name: "Eining", token: "--sl-spacing-element", value: "16px" },
        { name: "Í röð", token: "--sl-spacing-inline", value: "8px" },
        { name: "Þétt", token: "--sl-spacing-compact", value: "4px" }
    ];

    // Typography tokens
    const typographyTokens = [
        { name: "Fyrirsögn 1", token: "--sl-text-heading-1", sample: "Aðalfyrirsögn" },
        { name: "Fyrirsögn 2", token: "--sl-text-heading-2", sample: "Undirfyrirsögn" },
        { name: "Fyrirsögn 3", token: "--sl-text-heading-3", sample: "Þriðja stig" },
        { name: "Meginmál stórt", token: "--sl-text-body-lg", sample: "Stór meginmálstexti" },
        { name: "Meginmál", token: "--sl-text-body", sample: "Venjulegur meginmálstexti" },
        { name: "Meginmál lítið", token: "--sl-text-body-sm", sample: "Lítill meginmálstexti" },
        { name: "Myndatexti", token: "--sl-text-caption", sample: "Myndatexti og skýringar" }
    ];

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <h1 className={styles.pageTitle}>Slóði Litakerfi</h1>
                    <p className={styles.pageSubtitle}>Eftirfarandi síða er til að prufa litasamsetningar og sýna notkun huta ef þeim 909 hönnunartáknum (tokens) sem við höfum skilgreint fyrir þróun kerfisins. Einnig er þetta vetvangur sem hægt er að nýta til að prufa mismunandi þemu kerfisins og sjá hvernig litirnir virka með hvorum öðrum í misumandi samhengjum</p>
                    <div className={styles.headerActions}>
                        <ThemeSelector />
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                {/* Introduction */}
                <Section
                    title="Hvað er Slóði?"
                    subtitle="Þriggja-þrepa hönnunartáknkerfi byggt á bestu starfsvenjum iðnaðarins"
                >
                    <Card>
                        <div className={styles.intro}>
                            <div className={styles.introSection}>
                                <h3 className={styles.introTitle}>🏔️ Þrep 1: Frumefni (Primitives)</h3>
                                <p className={styles.introText}>
                                    Hrá gildi sem eru samhengislaus. Notast aldrei beint í íhlutum.
                                </p>
                                <code className={styles.introCode}>--sl-primitive-moss-600: 92 39% 30%</code>
                            </div>

                            <div className={styles.introSection}>
                                <h3 className={styles.introTitle}>🎨 Þrep 2: Merkingarfræði (Semantics)</h3>
                                <p className={styles.introText}>
                                    Samhengismeðvituð tákn sem vísa í frumefni. Notast beint í hönnun.
                                </p>
                                <code className={styles.introCode}>--sl-color-primary: var(--sl-primitive-moss-600)</code>
                            </div>

                            <div className={styles.introSection}>
                                <h3 className={styles.introTitle}>🔧 Þrep 3: Íhlutir (Components)</h3>
                                <p className={styles.introText}>
                                    Íhlutatengd tákn sem vísa í merkingarfræði. Notast innan íhluta.
                                </p>
                                <code className={styles.introCode}>--sl-button-background-primary: var(--sl-color-primary)</code>
                            </div>
                        </div>
                    </Card>
                </Section>

                {/* Brand Colors */}
                <Section
                    title="Náttúrulitirnir"
                    subtitle="Byggir á íslenskri víðernu - birki, mosa, furu og berki"
                >
                    <div className={styles.grid5}>
                        {natureColors.map((c) => (
                            <Swatch key={c.name} name={c.name} token={c.token} note={c.note} />
                        ))}
                    </div>
                </Section>

                {/* Semantic States */}
                <Section
                    title="Merkingarstaðar"
                    subtitle="Litir fyrir árangur, aðvaranir, villur og upplýsingar"
                >
                    <div className={styles.grid4}>
                        {semanticColors.map((c) => (
                            <Card key={c.name}>
                                <div
                                    className={styles.semanticBlock}
                                    style={{ background: `hsl(var(${c.token}))` }}
                                >
                                    <span className={styles.semanticLabel}>{c.name}</span>
                                </div>
                                <div className={styles.semanticInfo}>
                                    <code className={styles.semanticToken}>{c.token}</code>
                                    <div
                                        className={styles.semanticSubtle}
                                        style={{ background: `hsl(var(${c.subtle}))` }}
                                    >
                                        Léttur bakgrunnur
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Section>

                {/* Patrol Colors */}
                <Section
                    title="Skátasveitarlitir"
                    subtitle="Fullkomið kerfi fyrir allar 6 sveitir með afbrigðum"
                >
                    <div className={styles.grid3}>
                        {scouts.map((s) => (
                            <Card key={s.name} className={styles.patrolCard}>
                                <div
                                    className={styles.patrolHeader}
                                    style={{
                                        background: `hsl(var(${s.base}))`,
                                        color: `hsl(var(${s.fg}))`
                                    }}
                                >
                                    <h3 className={styles.patrolName}>{s.name}</h3>
                                    <div className={styles.patrolBadgeDemo}>
                                        <PatrolBadge name={s.name} token={s.base} fgToken={s.fg} />
                                    </div>
                                </div>
                                <div className={styles.patrolVariants}>
                                    <div className={styles.patrolVariant}>
                                        <span className={styles.variantLabel}>Grunnlitur</span>
                                        <code className={styles.variantToken}>{s.base}</code>
                                        <div
                                            className={styles.variantSwatch}
                                            style={{ background: `hsl(var(${s.base}))` }}
                                        />
                                    </div>
                                    <div className={styles.patrolVariant}>
                                        <span className={styles.variantLabel}>Sveimunartengsl</span>
                                        <code className={styles.variantToken}>{s.hover}</code>
                                        <div
                                            className={styles.variantSwatch}
                                            style={{ background: `hsl(var(${s.hover}))` }}
                                        />
                                    </div>
                                    <div className={styles.patrolVariant}>
                                        <span className={styles.variantLabel}>Léttur bakgrunnur</span>
                                        <code className={styles.variantToken}>{s.subtle}</code>
                                        <div
                                            className={styles.variantSwatch}
                                            style={{ background: `hsl(var(${s.subtle}))` }}
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Section>

                {/* Text Colors */}
                <Section
                    title="Textalitirnir"
                    subtitle="Stigveldi texta frá aðal til óvirkra"
                >
                    <Card>
                        <div className={styles.textDemo}>
                            {textColors.map((t) => (
                                <div key={t.name} className={styles.textRow}>
                                    <div
                                        className={styles.textSample}
                                        style={{ color: `hsl(var(${t.token}))` }}
                                    >
                                        Kæmi ný öxi hér, ykist þjófum nú bæði víl og ádrepa
                                    </div>
                                    <div className={styles.textInfo}>
                                        <span className={styles.textName}>{t.name}</span>
                                        <code className={styles.textToken}>{t.token}</code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Section>

                {/* Components Showcase */}
                <Section
                    title="Íhlutir"
                    subtitle="Raunverulegir íhlutir byggðir með táknum"
                >
                    <Card>
                        <div className={styles.componentShowcase}>
                            <div className={styles.componentGroup}>
                                <h4 className={styles.componentTitle}>Hnappar</h4>
                                <div className={styles.componentRow}>
                                    <UIButton variant="primary">Aðalhnappur</UIButton>
                                    <UIButton variant="secondary">Aukahnappur</UIButton>
                                    <UIButton variant="ghost">Dulinn</UIButton>
                                </div>
                                <div className={styles.componentRow}>
                                    <UIButton variant="primary" size="sm">Lítill</UIButton>
                                    <UIButton variant="primary" size="md">Miðlungs</UIButton>
                                    <UIButton variant="primary" size="lg">Stór</UIButton>
                                </div>
                            </div>

                            <div className={styles.componentGroup}>
                                <h4 className={styles.componentTitle}>Innsláttarreitir</h4>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Venjulegur innsláttarreitur"
                                />
                                <input
                                    type="email"
                                    className={cx(styles.input, styles.inputError)}
                                    placeholder="Innsláttarreitur með villu"
                                />
                            </div>

                            <div className={styles.componentGroup}>
                                <h4 className={styles.componentTitle}>Merki</h4>
                                <div className={styles.componentRow}>
                                    {scouts.map(s => (
                                        <PatrolBadge
                                            key={s.name}
                                            name={s.name}
                                            token={s.base}
                                            fgToken={s.fg}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Section>

                {/* Alerts */}
                <Section title="Viðvaranir og tilkynningar">
                    <div className={styles.grid2}>
                        <UIAlert
                            tone="success"
                            title="Tókst"
                            body="Aðgerð kláraðist án vandræða."
                        />
                        <UIAlert
                            tone="warning"
                            title="Aðvörun"
                            body="Athugaðu þetta áður en þú heldur áfram."
                        />
                        <UIAlert
                            tone="error"
                            title="Villa"
                            body="Eitthvað fór úrskeiðis. Reyndu aftur."
                        />
                        <UIAlert
                            tone="info"
                            title="Upplýsingar"
                            body="Hér eru viðbótarupplýsingar fyrir notendur."
                        />
                    </div>
                </Section>

                {/* Spacing */}
                <Section
                    title="Bili"
                    subtitle="4px grunnkvarði fyrir samræmt rými"
                >
                    <div className={styles.spacingList}>
                        {spacingTokens.map((s) => (
                            <div key={s.name} className={styles.spacingItem}>
                                <div className={styles.spacingInfo}>
                                    <span className={styles.spacingName}>{s.name}</span>
                                    <code className={styles.spacingToken}>{s.token}</code>
                                    <span className={styles.spacingValue}>{s.value}</span>
                                </div>
                                <div className={styles.spacingVisual}>
                                    <div
                                        className={styles.spacingBar}
                                        style={{ width: `var(${s.token})` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Typography */}
                <Section
                    title="Leturstærðir"
                    subtitle="Kvarði fyrir fyrirsagnir og meginmál"
                >
                    <div className={styles.typographyList}>
                        {typographyTokens.map((t) => (
                            <div key={t.name} className={styles.typographyItem}>
                                <div
                                    className={styles.typographySample}
                                    style={{ fontSize: `var(${t.token})` }}
                                >
                                    {t.sample}
                                </div>
                                <div className={styles.typographyInfo}>
                                    <span className={styles.typographyName}>{t.name}</span>
                                    <code className={styles.typographyToken}>{t.token}</code>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Token Inspector */}
                <Section
                    title="Táknaskoðari"
                    subtitle="Skoðaðu reiknuð gildi tákna í rauntíma"
                >
                    <div className={styles.grid3}>
                        <TokenInspector
                            token="--sl-color-primary"
                            label="Aðallitur"
                            type="color"
                        />
                        <TokenInspector
                            token="--sl-spacing-component"
                            label="Íhlutabil"
                            type="spacing"
                        />
                        <TokenInspector
                            token="--sl-text-body"
                            label="Meginmálsstærð"
                            type="text"
                        />
                    </div>
                </Section>

                {/* Patrol Colors on Different Backgrounds */}
                <Section
                    title="Sveitarlitir á mismunandi bakgrunni"
                    subtitle="Hvernig sveitalitir hegða sér á aðallitum"
                >
                    <div className={styles.grid2}>
                        {[
                            { name: "Aðalbakgrunnur", token: "--sl-color-background" },
                            { name: "Yfirborð", token: "--sl-color-surface" },
                            { name: "Aðallitur", token: "--sl-color-primary" },
                            { name: "Aukalitur", token: "--sl-color-secondary" }
                        ].map((bg) => (
                            <Card key={bg.token}>
                                <div
                                    className={styles.patrolBgTest}
                                    style={{ background: `hsl(var(${bg.token}))` }}
                                >
                                    <div className={styles.patrolBgLabel}>{bg.name}</div>
                                    <div className={styles.patrolBgGrid}>
                                        {scouts.map((s) => (
                                            <div key={s.name} className={styles.patrolBgItem}>
                                                <PatrolBadge
                                                    name={s.name}
                                                    token={s.base}
                                                    fgToken={s.fg}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Section>
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerInner}>
                    <p>Slóði Design System · 909 hönnunartákn · Byggt á HSL breytum</p>
                    <p>Prófaðu mismunandi þemu til að sjá hvernig kerfið aðlagast</p>
                </div>
            </footer>
        </div>
    );
}